import { memo, useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Loader2 } from 'lucide-react';

// Character Node - For representing characters in the narrative
export const CharacterNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with the textarea
  const onTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 dark:bg-slate-800">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-blue-100 dark:bg-blue-900">
          {data.emoji || '👤'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.nftId && (
            <div className="text-xs text-muted-foreground">NFT: {data.nftId}</div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onTextareaClick}
          onMouseDown={onTextareaClick}
          placeholder="Enter character description..."
          rows={2}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Plot Point Node - For representing key narrative events
export const PlotPointNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with the textarea
  const onTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-green-100 dark:bg-green-900">
          {data.emoji || '📝'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.canonicity && (
            <div className="text-xs">
              Canonicity: 
              <span className={data.canonicity === 'Canon' ? 'text-green-500' : 'text-amber-500'}>
                {data.canonicity}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onTextareaClick}
          onMouseDown={onTextareaClick}
          placeholder="Enter plot point description..."
          rows={2}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Media Node - For representing media content (videos, images, etc.)
export const MediaNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with the textarea or button
  const onInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Generate content and update the mediaUrl
  const handleGenerateContent = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node drag when clicking the button
    
    try {
      setIsGenerating(true);
      
      // Mock API call to generate content and get Walrus link
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Simulate getting a Walrus link back
      const walrusLink = `https://walrus.com/video/${Math.random().toString(36).substring(2, 10)}`;
      
      // Update the node data
      data.mediaUrl = walrusLink;
      
      alert(`Content generated! Walrus link: ${walrusLink}`);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [data]);
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-purple-100 dark:bg-purple-900">
          {data.emoji || '🎬'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.storageType && (
            <div className="text-xs text-muted-foreground">
              Storage: {data.storageType}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onInteractionClick}
          onMouseDown={onInteractionClick}
          placeholder="Enter media description..."
          rows={2}
        />
      </div>
      
      {/* Display current media URL if available */}
      {data.mediaUrl && (
        <div className="mt-2 text-xs text-muted-foreground break-all">
          <strong>Media URL:</strong> {data.mediaUrl}
        </div>
      )}
      
      {/* Generate Content Button */}
      <button
        onClick={handleGenerateContent}
        onMouseDown={onInteractionClick}
        disabled={isGenerating}
        className={`mt-2 w-full py-1 px-2 text-sm rounded ${isGenerating ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center justify-center`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Content'
        )}
      </button>
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Voting Node - For representing governance decisions
export const VotingNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with the textarea
  const onTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-amber-100 dark:bg-amber-900">
          {data.emoji || '🗳️'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.status && (
            <div className="text-xs">
              Status: 
              <span className={
                data.status === 'Active' ? 'text-green-500' : 
                data.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
              }>
                {data.status}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onTextareaClick}
          onMouseDown={onTextareaClick}
          placeholder="Enter voting description..."
          rows={2}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});
