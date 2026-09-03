interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className={`bg-red-900/30 border border-red-700/50 text-red-300 rounded-md px-4 py-3 text-sm ${className}`}>
      {message}
    </div>
  );
}
