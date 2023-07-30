import { PaperclipIcon } from 'lucide-react';
import { FC } from 'react';

import { UserState } from '../context/User';

function getHumanReadableDateTime() {
  const now = new Date();

  // Get date components
  const year = now.getFullYear();
  const month = now.toLocaleString("default", { month: "long" }); // e.g., "January"
  const day = now.getDate();

  // Get time components
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Concatenate the components into a human-readable date and time string
  const humanReadableDateTime = `${month} ${day}, ${year} - ${hours}:${minutes}:${seconds} ${ampm}`;

  return humanReadableDateTime;
}

const UserData: FC<UserState> = (user) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      {user.type === "student" ? (
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Applicant Information
            </h3>
            <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
              Personal details
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.name ?? "N/A"}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Roll Number
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.rollNumber}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Branch
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.branch}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Semester
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.semester}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Submited At
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.submittedAt ?? getHumanReadableDateTime()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : user.type === "employee" ? (
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Applicant Information
            </h3>
            <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
              Personal details
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.name ?? "N/A"}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Age
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.age}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Work Experience(Years)
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.workExperience}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name of organization
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.orgName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Gender
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.gender}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Submited At
                </dt>
                <dd className="mt-1 font-bold leading-6 text-gray-700 text-md sm:col-span-2 sm:mt-0">
                  {user.submittedAt ?? getHumanReadableDateTime()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserData;
