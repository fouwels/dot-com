// SPDX-FileCopyrightText: 2023 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
//
// SPDX-License-Identifier: MIT

import * as Polaris from '@cloudscape-design/components'

import { Navigation } from '../components/navigation'
import { Bio } from '../components/bio'

export function Main (): React.ReactElement {
  const breadcrumbs = [
    {
      text: 'Main',
      href: '#/main'
    },
    {
      text: 'Dashboard',
      href: '#/main'
    }
  ]
  const content = (
    <Polaris.ContentLayout header={<Polaris.Header variant='h1'>Main</Polaris.Header>}>
      <Bio />
    </Polaris.ContentLayout>
  )
  return (
    <Polaris.AppLayout
      breadcrumbs={
        <Polaris.BreadcrumbGroup items={breadcrumbs} ariaLabel='Breadcrumbs' />
      }
      navigation={<Navigation />}
      tools={<Polaris.HelpPanel>Nothing to see here</Polaris.HelpPanel>}
      content={content}
    />
  )
}
