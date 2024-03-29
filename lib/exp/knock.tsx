// SPDX-FileCopyrightText: 2023 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
//
// SPDX-License-Identifier: MIT

import * as Polaris from '@cloudscape-design/components'
import * as React from 'react'

// https://datatracker.ietf.org/doc/html/rfc5245#section-15.1
/* candidate-attribute   = "candidate" ":" foundation SP component-id SP
                           transport SP
                           priority SP
                           connection-address SP     ;from RFC 4566
                           port         ;port from RFC 4566
                           SP cand-type
                           [SP rel-addr]
                           [SP rel-port]
                           *(SP extension-att-name SPextension-att-value)
*/
// candidate:0 1 UDP 2122252543 faacd188-e6cf-42a4-8d8a-82de98cf60b2.local 64125 typ host
export interface Candidate {
  foundation: string
  componentId: string
  transport: string
  priority: string
  connectionAddress: string
  port: string
}

type RFC5245Callback = (c: Candidate) => void

// Get user's local ip mask
export async function RFC5245 (callback: RFC5245Callback): Promise<void> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.services.mozilla.com' }]
  })

  // listen for candidate events
  pc.onicecandidate = (ice) => {
    // skip if not a candidate event
    if (ice.candidate === null || ice.candidate.candidate === null || ice.candidate.candidate === '') {
      return
    }

    const c: Candidate = {
      foundation: ice.candidate.candidate.split(' ')[0] ?? '',
      componentId: ice.candidate.candidate.split(' ')[1] ?? '',
      transport: ice.candidate.candidate.split(' ')[2] ?? '',
      priority: ice.candidate.candidate.split(' ')[3] ?? '',
      connectionAddress: ice.candidate.candidate.split(' ')[4] ?? '',
      port: ice.candidate.candidate.split(' ')[5] ?? ''
    }
    console.debug('exp::Knock: got candidate: ' + ice.candidate.candidate)
    callback(c)
  }

  // create a dummy data channel
  pc.createDataChannel('')

  // create an offer sdp
  void pc.createOffer((result) => {
    // fire a stun server request
    void pc.setLocalDescription(result, () => { }, () => { })
  }, () => { })
}

export function Knock (): React.ReactElement {
  const [candidate, setCandidate] = React.useState<Candidate | undefined>()

  React.useEffect(() => {
    const run = async (): Promise<void> => {
      void RFC5245((c: Candidate) => {
        setCandidate(c)
      })
    }
    void run()
  }, [])

  return (
    <>
      <Polaris.Container>
        <Polaris.SpaceBetween size='m' direction='vertical'>
          <Polaris.Header>
            Knock
          </Polaris.Header>
          <Polaris.TextContent>WebRTC last identified you as:</Polaris.TextContent>
          <Polaris.Textarea readOnly value={JSON.stringify(candidate, null, ' ')} rows={8} />
        </Polaris.SpaceBetween>
      </Polaris.Container>
    </>
  )
}
