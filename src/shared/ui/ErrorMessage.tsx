interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
      {message}
    </div>
  );
}
