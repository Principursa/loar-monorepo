import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/market')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/market"!</div>
}
