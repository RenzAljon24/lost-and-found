// components/form-message.tsx

export interface Message {
    type: 'success' | 'error';
    content: string;
  }
  
  export function Message({ type, content }: Message) {
    return (
      <div
        className={`p-4 mt-2 rounded-md ${
          type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}
      >
        {content}
      </div>
    );
  }
  