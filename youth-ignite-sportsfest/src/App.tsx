  // Countdown timer
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, MapPin, Clock, Star, Heart, Play, ChevronRight, Mail, Phone, Settings, BarChart3, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  sport: 'volleyball' | 'basketball';
  members: string[];
  captain: string;
  contact?: string;
  registrationDate?: string;
  status?: string;
}

interface AdminData {
  teams: Team[];
  stats: {
    totalTeams: number;
    basketballTeams: number;
    volleyballTeams: number;
    totalPlayers: number;
  };
  lastUpdated: string;
}

interface Registration {
  teamName: string;
  sport: 'volleyball' | 'basketball';
  captainName: string;
  captainContact: string;
  members: string[];
}

const SportsfestWebsite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Fire Hawks', sport: 'basketball', members: ['John', 'Mike', 'Sarah', 'Alex', 'Emma'], captain: 'John' },
    { id: 2, name: 'Thunder Bolts', sport: 'volleyball', members: ['Lisa', 'Tom', 'Grace', 'David', 'Anna', 'Mark'], captain: 'Lisa' },
    { id: 3, name: 'Lightning Strikers', sport: 'basketball', members: ['Chris', 'Maya', 'Josh', 'Kate', 'Ryan'], captain: 'Chris' }
  ]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registration, setRegistration] = useState<Registration>({
    teamName: '',
    sport: 'volleyball',
    captainName: '',
    captainContact: '',
    members: ['', '', '', '']
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Admin functions
  const fetchAdminData = async () => {
    setIsLoadingAdmin(true);
    try {
      // Replace with your Google Apps Script URL for reading data
      const GOOGLE_READ_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwXWe84LjHjAiSbPkRJv5kNT09y5cplAkRm4cSyfIcy2y9TJ3TZI7Z0GlAJdKBm4of-/exec';
      
      const response = await fetch(GOOGLE_READ_SCRIPT_URL);
      const data = await response.json();
      
      if (data.success) {
        const fetchedTeams = data.teams.map((team: any, index: number) => ({
          id: index + 1,
          name: team.teamName,
          sport: team.sport,
          members: team.members.split(', '),
          captain: team.captainName,
          contact: team.captainContact,
          registrationDate: team.registrationDate,
          status: team.status || 'Registered'
        }));

        const stats = {
          totalTeams: fetchedTeams.length,
          basketballTeams: fetchedTeams.filter((t: Team) => t.sport === 'basketball').length,
          volleyballTeams: fetchedTeams.filter((t: Team) => t.sport === 'volleyball').length,
          totalPlayers: fetchedTeams.reduce((sum: number, t: Team) => sum + t.members.length, 0)
        };

        setAdminData({
          teams: fetchedTeams,
          stats,
          lastUpdated: new Date().toLocaleString()
        });
        setTeams(fetchedTeams);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Could not fetch live data from Google Sheets. Showing local data.');
    }
    setIsLoadingAdmin(false);
  };

  const handleAdminLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (adminPassword === 'kingspoint2025') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setActiveTab('admin');
      fetchAdminData();
    } else {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    setActiveTab('home');
  };
  useEffect(() => {
    const targetDate = new Date('2025-07-15T09:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegistration = async () => {
    if (!registration.teamName || !registration.captainName || !registration.captainContact) {
      alert('Please fill in all required fields');
      return;
    }
    
    const requiredMembers = registration.members.slice(0, 4);
    if (requiredMembers.some(member => !member.trim())) {
      alert('Please fill in at least 4 team members');
      return;
    }

    // Prepare data for Google Sheets
    const formData = new FormData();
    formData.append('teamName', registration.teamName);
    formData.append('sport', registration.sport);
    formData.append('captainName', registration.captainName);
    formData.append('captainContact', registration.captainContact);
    formData.append('members', registration.members.filter(member => member.trim() !== '').join(', '));
    formData.append('registrationDate', new Date().toLocaleString());

    try {
      // Replace with your Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwXWe84LjHjAiSbPkRJv5kNT09y5cplAkRm4cSyfIcy2y9TJ3TZI7Z0GlAJdKBm4of-/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newTeam: Team = {
          id: teams.length + 1,
          name: registration.teamName,
          sport: registration.sport,
          members: registration.members.filter(member => member.trim() !== ''),
          captain: registration.captainName
        };
        setTeams([...teams, newTeam]);
        setRegistration({
          teamName: '',
          sport: 'volleyball',
          captainName: '',
          captainContact: '',
          members: ['', '', '', '']
        });
        setShowRegistration(false);
        alert('Team registered successfully! 🎉\nData saved to Google Sheets.');
      } else {
        throw new Error('Failed to save to Google Sheets');
      }
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      // Still allow local registration even if Google Sheets fails
      const newTeam: Team = {
        id: teams.length + 1,
        name: registration.teamName,
        sport: registration.sport,
        members: registration.members.filter(member => member.trim() !== ''),
        captain: registration.captainName
      };
      setTeams([...teams, newTeam]);
      setRegistration({
        teamName: '',
        sport: 'volleyball',
        captainName: '',
        captainContact: '',
        members: ['', '', '', '']
      });
      setShowRegistration(false);
      alert('Team registered successfully! 🎉\n(Note: There was an issue saving to Google Sheets, but your registration is recorded locally)');
    }
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...registration.members];
    newMembers[index] = value;
    setRegistration({ ...registration, members: newMembers });
  };

  const addMember = () => {
    if (registration.members.length < 8) {
      setRegistration({ ...registration, members: [...registration.members, ''] });
    }
  };

  const removeMember = (index: number) => {
    if (registration.members.length > 4) {
      const newMembers = registration.members.filter((_, i) => i !== index);
      setRegistration({ ...registration, members: newMembers });
    }
  };

  const TabButton: React.FC<{ id: string; children: React.ReactNode; icon: React.ReactNode }> = ({ id, children, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
        activeTab === id
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
          : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
      }`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="relative container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-white font-medium">Connecting Hearts Through Sports</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
              Kingspoint Sportsfest 2025
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our amazing community event where believers and non-believers come together for fun, friendship, and fantastic sports!
            </p>
            
            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
              {Object.entries(countdown).map(([unit, value]) => (
                <div key={unit} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-sm text-blue-200 capitalize">{unit}</div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-4">
              <TabButton id="home" icon={<Play className="w-5 h-5" />}>Home</TabButton>
              <TabButton id="register" icon={<Users className="w-5 h-5" />}>Register</TabButton>
              <TabButton id="teams" icon={<Trophy className="w-5 h-5" />}>Teams</TabButton>
              <TabButton id="schedule" icon={<Calendar className="w-5 h-5" />}>Schedule</TabButton>
              {isAdmin ? (
                <TabButton id="admin" icon={<Settings className="w-5 h-5" />}>Admin</TabButton>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-full font-medium hover:bg-white/20 transition-all duration-300 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Event Info Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Calendar className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">July 15, 2025</h3>
                <p className="text-blue-200">Mark your calendars for an epic day!</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Community Center</h3>
                <p className="text-blue-200">Kingspoint Sports Complex</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <Clock className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">9:00 AM - 6:00 PM</h3>
                <p className="text-blue-200">Full day of amazing games!</p>
              </div>
            </div>

            {/* Sports Available */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-8">Available Sports</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300">
                  <div className="text-6xl mb-4">🏀</div>
                  <h3 className="text-3xl font-bold text-white mb-4">Basketball</h3>
                  <p className="text-blue-200 mb-4">5v5 tournament format with exciting matches</p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm text-white">Teams: 3-8 players | Registration: Open</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300">
                  <div className="text-6xl mb-4">🏐</div>
                  <h3 className="text-3xl font-bold text-white mb-4">Volleyball</h3>
                  <p className="text-blue-200 mb-4">6v6 matches with round-robin format</p>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm text-white">Teams: 6-12 players | Registration: Open</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Join the Fun?</h2>
              <p className="text-xl text-blue-200 mb-8">Register your team now and be part of this amazing community event!</p>
              <button
                onClick={() => setActiveTab('register')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
              >
                Register Your Team
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Team Registration</h2>
              
              {!showRegistration ? (
                <div className="text-center">
                  <p className="text-blue-200 mb-8">Ready to register your team? Let's get started!</p>
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Start Registration
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Team Name</label>
                    <input
                      type="text"
                      required
                      value={registration.teamName}
                      onChange={(e) => setRegistration({ ...registration, teamName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Enter your team name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Sport</label>
                    <select
                      value={registration.sport}
                      onChange={(e) => setRegistration({ ...registration, sport: e.target.value as 'volleyball' | 'basketball' })}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                    >
                      <option value="volleyball" className="bg-gray-800">Volleyball</option>
                      <option value="basketball" className="bg-gray-800">Basketball</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Team Captain</label>
                    <input
                      type="text"
                      required
                      value={registration.captainName}
                      onChange={(e) => setRegistration({ ...registration, captainName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Captain's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Captain's Contact</label>
                    <input
                      type="tel"
                      required
                      value={registration.captainContact}
                      onChange={(e) => setRegistration({ ...registration, captainContact: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      placeholder="Phone number or email"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Team Members</label>
                    {registration.members.map((member, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={member}
                          onChange={(e) => updateMember(index, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                          placeholder={`Player ${index + 1} name`}
                          required={index < 4}
                        />
                        {index >= 4 && (
                          <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="px-4 py-3 bg-red-500/50 text-white rounded-lg hover:bg-red-500/70 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {registration.members.length < 8 && (
                      <button
                        type="button"
                        onClick={addMember}
                        className="mt-2 px-4 py-2 bg-green-500/50 text-white rounded-lg hover:bg-green-500/70 transition-colors"
                      >
                        Add Member
                      </button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleRegistration}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Register Team
                    </button>
                    <button
                      onClick={() => setShowRegistration(false)}
                      className="px-6 bg-white/20 text-white py-4 rounded-lg font-bold hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Registered Teams</h2>
            <div className="grid gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">
                      {team.sport === 'basketball' ? '🏀' : '🏐'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                      <p className="text-blue-200 capitalize">{team.sport}</p>
                    </div>
                    <div className="ml-auto">
                      <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white font-semibold mb-2">Team Captain:</p>
                      <p className="text-blue-200">{team.captain}</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-2">Members ({team.members.length}):</p>
                      <p className="text-blue-200">{team.members.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-blue-200 text-xl">No teams registered yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Event Schedule</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { time: '8:00 AM', event: 'Registration & Check-in', desc: 'Team registration and final confirmations' },
                { time: '9:00 AM', event: 'Opening Ceremony', desc: 'Welcome message and team introductions' },
                { time: '9:30 AM', event: 'Volleyball Preliminaries', desc: 'Round-robin matches begin' },
                { time: '10:30 AM', event: 'Basketball Preliminaries', desc: 'Group stage matches' },
                { time: '12:00 PM', event: 'Lunch Break', desc: 'Food and fellowship time' },
                { time: '1:00 PM', event: 'Volleyball Finals', desc: 'Championship matches' },
                { time: '2:30 PM', event: 'Basketball Finals', desc: 'Championship matches' },
                { time: '4:00 PM', event: 'Awards Ceremony', desc: 'Trophies and recognition' },
                { time: '5:00 PM', event: 'Fellowship & Closing', desc: 'Community time and refreshments' }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 min-w-fit">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-bold text-white">{item.time}</span>
                        <span className="text-xl font-semibold text-blue-200">{item.event}</span>
                      </div>
                      <p className="text-blue-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-white">Admin Dashboard</h2>
              <div className="flex gap-4">
                <button
                  onClick={fetchAdminData}
                  disabled={isLoadingAdmin}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingAdmin ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {adminData && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{adminData.stats.totalTeams}</div>
                    <div className="text-green-200">Total Teams</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{adminData.stats.basketballTeams}</div>
                    <div className="text-orange-200">Basketball</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{adminData.stats.volleyballTeams}</div>
                    <div className="text-blue-200">Volleyball</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{adminData.stats.totalPlayers}</div>
                    <div className="text-purple-200">Total Players</div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-center">
                  <p className="text-blue-200">Last updated: {adminData.lastUpdated}</p>
                </div>

                {/* Teams Management */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Team Management</h3>
                  <div className="space-y-4">
                    {adminData.teams.map((team) => (
                      <div key={team.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{team.sport === 'basketball' ? '🏀' : '🏐'}</span>
                              <h4 className="text-lg font-bold text-white">{team.name}</h4>
                            </div>
                            <p className="text-blue-200 text-sm capitalize">{team.sport}</p>
                          </div>
                          <div>
                            <p className="text-white font-semibold">Captain:</p>
                            <p className="text-blue-200">{team.captain}</p>
                            {team.contact && (
                              <p className="text-blue-300 text-sm">{team.contact}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold">Players ({team.members.length}):</p>
                            <p className="text-blue-200 text-sm">{team.members.join(', ')}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${team.status === 'Registered' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                              <span className="text-white font-semibold">{team.status || 'Registered'}</span>
                            </div>
                            {team.registrationDate && (
                              <p className="text-blue-300 text-sm">{team.registrationDate}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Export Teams List
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Generate Brackets
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                      Send Notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  className="px-6 bg-white/20 text-white py-3 rounded-lg font-bold hover:bg-white/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p className="text-blue-200 text-sm text-center mt-4">
              Hint: Default password is "kingspoint2025"
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-blue-200">
              <Mail className="w-5 h-5" />
              <span>kingspoint.youth@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <Phone className="w-5 h-5" />
              <span>+63 XXX XXX XXXX</span>
            </div>
          </div>
          <p className="text-blue-300">
            Kingspoint Christian Community • Connecting hearts through sports • 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SportsfestWebsite;