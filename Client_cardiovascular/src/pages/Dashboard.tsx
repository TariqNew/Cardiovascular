import React, { useEffect, useState } from "react";
import HealthSummaryCard from "../components/HealthSummaryCard";
import MealCard from "../components/MealCard";
import ProgressBar from "../components/ProgressBar";
import EducationalResourceCard from "../components/EducationalResourceCard";
import { initializeCharts } from "../services/chartService";

interface HealthData {
  bloodPressure: string;
  weight: number;
  cholesterolLevel: string;
  bmi: number;
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    initializeCharts();
  }, []);

  const [healthData, setHealthData] = useState({
    bloodPressure: "0/0",
    weight: 0,
    cholesterolLevel: 0,
    bmi: 0,
  });

  useEffect(() => {
    const fetchHealth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          "http://localhost:5050/api/health/profile",
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
          bloodPressure: data.bloodPressure || "",
          weight: data.weight || 0,
          cholesterolLevel: data.cholesterolLevel || "",
          bmi: data.bmi || 0,
        });
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchHealth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5050/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserName(data.firstName || "User"); // Adjust according to API response
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  // Format today’s date (e.g., June 24, 2025)
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Health Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {userName}. Here's your health overview for {today}.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer"
          >
            <i className="fas fa-download mr-2"></i>
            Export Report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <HealthSummaryCard
          icon="fa-heartbeat"
          title="Blood Pressure"
          value={healthData.bloodPressure}
          change="4%"
          bgColor="bg-red-100"
          iconColor="text-red-600"
          linkText="View history"
        />
        <HealthSummaryCard
          icon="fa-weight"
          title="Weight"
          value={`${healthData.weight} kg`}
          change="3.8%"
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          linkText="View history"
        />
        <HealthSummaryCard
          icon="fa-vial"
          title="Cholesterol"
          value={`${healthData.cholesterolLevel} mg/dL`}
          change="13.6%"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          linkText="View details"
        />
        <HealthSummaryCard
          icon="fa-chart-pie"
          title="BMI"
          value={healthData.bmi ? healthData.bmi.toFixed(1) : ""}
          change="4.6%"
          bgColor="bg-green-100"
          iconColor="text-green-600"
          linkText="View details"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div id="weight-chart" style={{ height: "300px" }}></div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div id="bp-chart" style={{ height: "300px" }}></div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div id="cholesterol-chart" style={{ height: "300px" }}></div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div id="bmi-chart" style={{ height: "300px" }}></div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Today's Recommended Meals
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <MealCard
            title="Breakfast"
            description="Berry Oatmeal with Nuts"
            image="https://readdy.ai/api/search-image?query=Healthy%20breakfast%20with%20oatmeal%2C%20fresh%20berries%2C%20nuts%20and%20honey%20in%20a%20white%20bowl%20on%20light%20background.%20Top%20view%20of%20nutritious%20morning%20meal%20for%20cardiovascular%20health%20with%20vibrant%20colors%20and%20natural%20ingredients&width=600&height=400&seq=1&orientation=landscape"
            alt="Breakfast"
            calories="320 calories"
            feature="Heart-healthy"
            featureIcon="fa-heartbeat"
            featureColor="text-red-500"
          />
          <MealCard
            title="Lunch"
            description="Mediterranean Salmon Bowl"
            image="https://readdy.ai/api/search-image?query=Healthy%20Mediterranean%20lunch%20with%20grilled%20salmon%2C%20quinoa%2C%20fresh%20vegetables%2C%20olive%20oil%2C%20and%20lemon%20on%20a%20white%20plate.%20Nutritious%20meal%20for%20cardiovascular%20health%20with%20vibrant%20colors%20and%20balanced%20ingredients&width=600&height=400&seq=2&orientation=landscape"
            alt="Lunch"
            calories="450 calories"
            feature="Omega-3 rich"
            featureIcon="fa-fish"
            featureColor="text-blue-500"
          />
          <MealCard
            title="Dinner"
            description="Herb Chicken with Vegetables"
            image="https://readdy.ai/api/search-image?query=Healthy%20dinner%20with%20baked%20chicken%20breast%2C%20steamed%20broccoli%2C%20sweet%20potatoes%2C%20and%20herbs%20on%20a%20white%20plate.%20Low-sodium%20nutritious%20meal%20for%20cardiovascular%20health%20with%20vibrant%20colors%20and%20balanced%20ingredients&width=600&height=400&seq=3&orientation=landscape"
            alt="Dinner"
            calories="380 calories"
            feature="Low sodium"
            featureIcon="fa-drumstick-bite"
            featureColor="text-yellow-700"
          />
        </div>
        <div className="mt-4 text-right">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 !rounded-button whitespace-nowrap cursor-pointer">
            View full meal plan <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Weekly Progress Summary
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            June 15 - June 21, 2025
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <ProgressBar
              title="Diet Compliance"
              value="85%"
              target="Target: 80%"
              progress={85}
              icon="fa-check"
              bgColor="bg-green-100"
              progressColor="bg-green-500"
            />
            <ProgressBar
              title="BP Readings"
              value="7/7 days"
              target="Target: 7 days"
              progress={100}
              icon="fa-tachometer-alt"
              bgColor="bg-blue-100"
              progressColor="bg-blue-500"
            />
            <ProgressBar
              title="Overall Progress"
              value="92%"
              target="Target: 85%"
              progress={92}
              icon="fa-award"
              bgColor="bg-indigo-100"
              progressColor="bg-indigo-500"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recommended Educational Resources
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <EducationalResourceCard
            icon="fa-book-medical"
            title="Understanding Cholesterol"
            description="Learn about the different types of cholesterol and how they affect your heart health."
            duration="5 min read"
            rating="4.8/5"
            bgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <EducationalResourceCard
            icon="fa-video"
            title="Cooking for Heart Health"
            description="Video tutorial on preparing heart-healthy meals with simple ingredients."
            duration="12 min video"
            rating="4.9/5"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <EducationalResourceCard
            icon="fa-file-pdf"
            title="DASH Diet Guide"
            description="Comprehensive guide to following the DASH diet for managing blood pressure."
            duration="PDF download"
            rating="4.7/5"
            bgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
