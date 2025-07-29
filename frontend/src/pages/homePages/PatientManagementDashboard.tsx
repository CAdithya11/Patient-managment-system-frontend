import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Download,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  User,
  Activity,
  Sparkles,
  Heart,
  Shield,
  TrendingUp,
  Filter,
} from 'lucide-react';

// Types based on your API structure
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  bloodType: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  registrationDate: string;
  lastVisit?: string;
}

// Dummy data
const dummyPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'MALE',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse',
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Shellfish'],
    bloodType: 'O+',
    status: 'ACTIVE',
    registrationDate: '2023-01-15',
    lastVisit: '2024-07-20',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1992-03-22',
    gender: 'FEMALE',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '+1 (555) 876-5432',
      relationship: 'Father',
    },
    medicalHistory: ['Asthma'],
    allergies: ['Latex'],
    bloodType: 'A-',
    status: 'ACTIVE',
    registrationDate: '2023-03-10',
    lastVisit: '2024-07-25',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1978-11-08',
    gender: 'MALE',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1 (555) 765-4321',
      relationship: 'Wife',
    },
    medicalHistory: ['High Cholesterol', 'Arthritis'],
    allergies: ['Peanuts'],
    bloodType: 'B+',
    status: 'PENDING',
    registrationDate: '2024-07-01',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1995-09-14',
    gender: 'FEMALE',
    address: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
    },
    emergencyContact: {
      name: 'Robert Williams',
      phone: '+1 (555) 654-3210',
      relationship: 'Brother',
    },
    medicalHistory: [],
    allergies: [],
    bloodType: 'AB+',
    status: 'INACTIVE',
    registrationDate: '2022-12-05',
    lastVisit: '2024-02-10',
  },
];

const PatientManagement: React.FC = () => {
  const [patients] = useState<Patient[]>(dummyPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'ALL' || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-emerald-200 shadow-lg';
      case 'INACTIVE':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-red-200 shadow-lg';
      case 'PENDING':
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-amber-200 shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-gray-200 shadow-lg';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const openPatientModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const getGradientByInitials = (firstName: string, lastName: string) => {
    const gradients = [
      'from-violet-600 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-green-500 to-emerald-600',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-violet-600',
    ];
    const index = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Patient Management
                </h1>
                <p className="mt-2 text-gray-600 font-medium">Advanced healthcare management system</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                <Download className="relative w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                <span className="relative font-semibold">Export</span>
              </button>
              <button className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Plus className="relative w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-300" />
                <span className="relative font-semibold">Add Patient</span>
                <Sparkles className="relative w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Patients',
              value: patients.length,
              icon: User,
              gradient: 'from-blue-500 to-cyan-600',
              bgGradient: 'from-blue-50 to-cyan-50',
            },
            {
              title: 'Active Patients',
              value: patients.filter((p) => p.status === 'ACTIVE').length,
              icon: Activity,
              gradient: 'from-emerald-500 to-green-600',
              bgGradient: 'from-emerald-50 to-green-50',
            },
            {
              title: 'Pending',
              value: patients.filter((p) => p.status === 'PENDING').length,
              icon: Calendar,
              gradient: 'from-amber-500 to-orange-600',
              bgGradient: 'from-amber-50 to-orange-50',
            },
            {
              title: 'Inactive',
              value: patients.filter((p) => p.status === 'INACTIVE').length,
              icon: Shield,
              gradient: 'from-red-500 to-pink-600',
              bgGradient: 'from-red-50 to-pink-50',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer`}
              onMouseEnter={() => setHoveredCard(`stat-${index}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+12% from last month</span>
                  </div>
                </div>
                <div
                  className={`p-4 bg-gradient-to-r ${
                    stat.gradient
                  } rounded-2xl shadow-lg transform transition-transform duration-300 ${
                    hoveredCard === `stat-${index}` ? 'scale-110 rotate-12' : ''
                  }`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:bg-white/80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-12 pr-8 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 hover:bg-white/80 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                <tr>
                  {['Patient', 'Contact', 'Age/Gender', 'Blood Type', 'Status', 'Last Visit', 'Actions'].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {paginatedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                    onMouseEnter={() => setHoveredCard(patient.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${getGradientByInitials(
                            patient.firstName,
                            patient.lastName
                          )} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-transform duration-300 ${
                            hoveredCard === patient.id ? 'scale-110 rotate-3' : ''
                          }`}
                        >
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500 font-medium">ID: {patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700">
                          <div className="p-1 bg-blue-100 rounded-lg mr-3">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="p-1 bg-green-100 rounded-lg mr-3">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-semibold text-gray-900">
                        {calculateAge(patient.dateOfBirth)} years
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{patient.gender}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                        {patient.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                          patient.status
                        )} transform transition-transform duration-300 hover:scale-105`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-semibold text-gray-900">
                      {patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center space-x-2">
                        {[
                          { icon: Eye, color: 'blue', action: () => openPatientModal(patient) },
                          { icon: Edit3, color: 'green', action: () => {} },
                          { icon: Trash2, color: 'red', action: () => {} },
                        ].map((btn, btnIndex) => (
                          <button
                            key={btnIndex}
                            onClick={btn.action}
                            className={`group p-3 text-${btn.color}-600 hover:text-white bg-${btn.color}-50 hover:bg-gradient-to-r hover:from-${btn.color}-500 hover:to-${btn.color}-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-translate-y-1`}
                          >
                            <btn.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm px-6 py-5 border-t border-gray-200/50 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'border border-gray-300 text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:shadow-lg'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative p-8 border-b border-gray-200/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-t-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${getGradientByInitials(
                      selectedPatient.firstName,
                      selectedPatient.lastName
                    )} rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-xl`}
                  >
                    {selectedPatient.firstName[0]}
                    {selectedPatient.lastName[0]}
                  </div>
                  <div className="ml-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h2>
                    <p className="text-gray-600 font-semibold text-lg">Patient ID: {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: User, label: 'Age', value: `${calculateAge(selectedPatient.dateOfBirth)} years old` },
                      { icon: Calendar, label: 'Date of Birth', value: formatDate(selectedPatient.dateOfBirth) },
                      { icon: User, label: 'Gender', value: selectedPatient.gender },
                      { icon: Activity, label: 'Blood Type', value: selectedPatient.bloodType },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white/80 rounded-2xl">
                        <div className="p-2 bg-blue-100 rounded-xl mr-4">
                          <item.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                          <p className="text-gray-900 font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-3">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white/80 rounded-2xl">
                      <div className="p-2 bg-green-100 rounded-xl mr-4">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Email</p>
                        <p className="text-gray-900 font-bold">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/80 rounded-2xl">
                      <div className="p-2 bg-green-100 rounded-xl mr-4">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Phone</p>
                        <p className="text-gray-900 font-bold">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white/80 rounded-2xl">
                      <div className="p-2 bg-green-100 rounded-xl mr-4 mt-0.5">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Address</p>
                        <p className="text-gray-900 font-bold">
                          {selectedPatient.address.street}
                          <br />
                          {selectedPatient.address.city}, {selectedPatient.address.state}{' '}
                          {selectedPatient.address.zipCode}
                          <br />
                          {selectedPatient.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl mr-3">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Medical Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Medical History</p>
                      {selectedPatient.medicalHistory.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.medicalHistory.map((condition, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm bg-white/60 p-3 rounded-xl">No medical history recorded</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Allergies</p>
                      {selectedPatient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.map((allergy, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm bg-white/60 p-3 rounded-xl">No known allergies</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl mr-3">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Emergency Contact
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: User, label: 'Name', value: selectedPatient.emergencyContact.name },
                      { icon: Phone, label: 'Phone', value: selectedPatient.emergencyContact.phone },
                      { icon: Heart, label: 'Relationship', value: selectedPatient.emergencyContact.relationship },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 bg-white/80 rounded-2xl">
                        <div className="p-2 bg-amber-100 rounded-xl mr-4">
                          <item.icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">{item.label}</p>
                          <p className="text-gray-900 font-bold">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration Info */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 border border-rose-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl mr-3">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Registration Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white/80 rounded-2xl">
                      <div className="p-2 bg-rose-100 rounded-xl mr-4">
                        <Calendar className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Registration Date</p>
                        <p className="text-gray-900 font-bold">{formatDate(selectedPatient.registrationDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white/80 rounded-2xl">
                      <div className="p-2 bg-rose-100 rounded-xl mr-4">
                        <Activity className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Status</p>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                            selectedPatient.status
                          )} mt-1`}
                        >
                          {selectedPatient.status}
                        </span>
                      </div>
                    </div>
                    {selectedPatient.lastVisit && (
                      <div className="flex items-center p-3 bg-white/80 rounded-2xl">
                        <div className="p-2 bg-rose-100 rounded-xl mr-4">
                          <Calendar className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Last Visit</p>
                          <p className="text-gray-900 font-bold">{formatDate(selectedPatient.lastVisit)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-b-3xl">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  Close
                </button>
                <button className="group relative px-6 py-3 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative font-semibold flex items-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Patient
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
