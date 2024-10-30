import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Shield, Cpu, Cloud } from 'lucide-react';

export function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Design Your Perfect
            <span className="text-blue-600"> Solar Setup</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Professional solar panel configuration tool for campervans. Design, calculate, and optimize your solar setup with ease.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Professional Design</h3>
              <p className="mt-2 text-gray-500">
                Industry-standard tools for precise solar panel placement and configuration.
              </p>
            </div>
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Smart Calculations</h3>
              <p className="mt-2 text-gray-500">
                Automatic power calculations and MPPT recommendations for optimal performance.
              </p>
            </div>
            <div className="relative p-6 bg-white rounded-lg shadow-md">
              <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Cloud Storage</h3>
              <p className="mt-2 text-gray-500">
                Save and access your designs from anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}