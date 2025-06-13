import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry, 
  className = '' 
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-700">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-2 text-sm text-red-800 hover:text-red-900 font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Intentar nuevamente</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}