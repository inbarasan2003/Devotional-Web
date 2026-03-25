import { useAuth } from "../../context/AuthProvider";

export default function Profile() {

  const { user} = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">

          {/* Profile Image */}
          <img
            src={user?.picture}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-orange-200 shadow-md object-cover"
          />

          {/* Name */}
          <h2 className="mt-3 text-xl font-semibold text-gray-800">
            {user?.name}
          </h2>

          {/* Email */}
          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        {/* Divider */}
        <div className="my-5 border-t" />

        {/* Info Section */}
        <div className="space-y-3">

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Type</span>
            <span className="font-medium text-gray-800">
              Google User
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="text-green-600 font-medium">
              Active
            </span>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">

        </div>

      </div>
    </div>
  );
}