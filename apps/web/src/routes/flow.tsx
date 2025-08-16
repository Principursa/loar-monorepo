import { createFileRoute } from '@tanstack/react-router';
import FlowEditor from '@/components/flow/FlowEditor';

export const Route = createFileRoute('/flow')({
  component: FlowPage,
});

function FlowPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Narrative Flow Editor</h1>
      <p className="mb-6 text-muted-foreground">
        Create and manage your narrative structures using the interactive flow editor below.
        Connect characters, plot points, and narrative elements to visualize your story's progression.
      </p>
      <div className="border rounded-lg overflow-hidden">
        <FlowEditor />
      </div>
    </div>
  );
}
