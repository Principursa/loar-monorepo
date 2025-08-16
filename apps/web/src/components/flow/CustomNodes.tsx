import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

// Character Node - For representing characters in the narrative
export const CharacterNode = memo(({ data, isConnectable }: NodeProps) => {
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
      {data.description && (
        <div className="mt-2 text-sm">{data.description}</div>
      )}
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
      {data.description && (
        <div className="mt-2 text-sm">{data.description}</div>
      )}
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
      {data.description && (
        <div className="mt-2 text-sm">{data.description}</div>
      )}
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
      {data.description && (
        <div className="mt-2 text-sm">{data.description}</div>
      )}
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
