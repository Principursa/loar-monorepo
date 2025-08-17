import { memo, useState, useEffect } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

// Character Node with editable description
export const EditableCharacterNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  useEffect(() => {
    if (data.description !== description) {
      data.description = description;
    }
  }, [description, data]);
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-700 ring-2 ring-blue-300' : 'border-blue-500'} dark:bg-slate-800`}>
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
          onChange={(e) => setDescription(e.target.value)}
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

// Plot Point Node with editable description
export const EditablePlotPointNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  useEffect(() => {
    if (data.description !== description) {
      data.description = description;
    }
  }, [description, data]);
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-green-700 ring-2 ring-green-300' : 'border-green-500'} dark:bg-slate-800`}>
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
          onChange={(e) => setDescription(e.target.value)}
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

// Media Node with editable description and URL
export const EditableMediaNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  
  // Update the node data when description or mediaUrl changes
  useEffect(() => {
    if (data.description !== description) {
      data.description = description;
    }
    if (data.mediaUrl !== mediaUrl) {
      data.mediaUrl = mediaUrl;
    }
  }, [description, mediaUrl, data]);
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-purple-700 ring-2 ring-purple-300' : 'border-purple-500'} dark:bg-slate-800`}>
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
        <input
          type="text"
          className="w-full p-1 mb-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Enter media URL..."
        />
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter media description..."
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

// Voting Node with editable description
export const EditableVotingNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  useEffect(() => {
    if (data.description !== description) {
      data.description = description;
    }
  }, [description, data]);
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-amber-700 ring-2 ring-amber-300' : 'border-amber-500'} dark:bg-slate-800`}>
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-amber-100 dark:bg-amber-900">
          {data.emoji || '🗳️'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.status && (
            <div className="text-xs">
              Status: 
              <span className={data.status === 'Active' ? 'text-green-500' : 'text-gray-500'}>
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
          onChange={(e) => setDescription(e.target.value)}
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
