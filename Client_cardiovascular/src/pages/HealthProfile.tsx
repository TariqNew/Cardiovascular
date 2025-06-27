import React, { useEffect, useState } from "react";
import EditHealthProfileForm from "../components/EditHealthProfileForm";

interface userData {
  firsName: string;
  lastName: string;
  email: string;
  gender: string;
}

const HealthProfile: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  const [healthForm, setHealthForm] = useState({
    age: 0,
    height: 0,
    weight: 0,
    bloodPressure: "",
    cholesterol: "",
    conditions: "",
    allergies: "",
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });

      const [healthData, setHealthData] = useState({
      height: "0",
      bloodPressure: "0/0",
      weight: 0,
      cholesterolLevel: 0,
      allergies: "allergic",
      bmi: 0,
    });
  

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:8000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("failed to fetch user data");
        }
        const data = await response.json();
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
        });
      } catch (err: any) {
        console.error(`Error has been occured ${err.message}`);
      }
    };

    fetchData();
  }, []);

    // Endpoint that fetches the health data
    useEffect(() => {
      const fetchHealth = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        try {
          const response = await fetch(
            "http://localhost:8000/api/health/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch health profile");
          }
  
          const data = await response.json();
          setHealthData({
            height: data.height || "",
            bloodPressure: data.bloodPressure || "",
            weight: data.weight || 0,
            cholesterolLevel: data.cholesterolLevel || "",
            bmi: data.bmi || 0,
            allergies: data.allergies,
          });
        } catch (error) {
          console.error("Error fetching health data:", error);
        }
      };
  
      fetchHealth();
    }, []);

  const handleHealthFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHealthForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Health Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal health information and medical data.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-download mr-2"></i>
            Export Profile
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-edit mr-2"></i>
            Edit Profile
          </button>
        </div>
      </div>
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex h-full items-start justify-center p-4 pt-10 backdrop-blur-xs backdrop-brightness-75"
          onClick={() => setShowForm(false)} // closes on outside click
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // prevents close on inside click
          >
            <EditHealthProfileForm
              form={healthForm}
              onChange={handleHealthFormChange}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Personal Information
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {userData.firstName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {userData.lastName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.gender}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">email</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Physical Measurements
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Height</dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.height}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Weight</dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.weight}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">BMI</dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.bmi}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Blood Pressure
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.bloodPressure}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Allergic Condition
                  </dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.allergies}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Cholesterol Level
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{healthData.cholesterolLevel}</dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Medical History
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Diagnosed Conditions
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hypertension (diagnosed 2020)</li>
                  <li>High Cholesterol (diagnosed 2021)</li>
                </ul>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Current Medications
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Lisinopril 10mg (daily)</li>
                  <li>Atorvastatin 20mg (daily)</li>
                </ul>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Allergies</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Penicillin</li>
                  <li>Shellfish</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Dietary Preferences
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Dietary Restrictions
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Low Sodium
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Low Cholesterol
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    No Shellfish
                  </span>
                </div>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Food Preferences
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Mediterranean Diet
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                    Vegetables
                  </span>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Fish
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
