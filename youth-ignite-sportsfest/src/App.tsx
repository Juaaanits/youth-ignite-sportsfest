import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, MapPin, Clock, Star, Heart, Play, ChevronRight, Mail, Phone } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  sport: 'volleyball' | 'basketball';
  members: string[];
  captain: string;
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

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2025-06-21T08:00:00').getTime();
    
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

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
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
    alert('Team registered successfully! 🎉');
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
        <div className="relative container mx-auto px-6 py-8 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-white font-medium">Connecting Hearts Through Sports</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
              Youth Ignite Sportsfest 2025
            </h1>
            <p></p>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
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
                <h3 className="text-2xl font-bold text-white mb-2">June 21, 2025</h3>
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
                <form onSubmit={handleRegistration} className="space-y-6">
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
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Register Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegistration(false)}
                      className="px-6 bg-white/20 text-white py-4 rounded-lg font-bold hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
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
      </main>

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
            Kingspoint Christian Community Church • Youth Ignite 
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SportsfestWebsite;