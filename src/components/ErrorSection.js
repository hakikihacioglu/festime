import { XCircleIcon } from '@heroicons/react/20/solid';

const ErrorSection = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md bg-red-50 p-4 mt-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">There were {errors.length} errors with your submission</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorSection;
