import React from 'react'
import { Phone, ExternalLink, MapPin, Shield, Heart, Scale, ChevronLeft, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const resources = [
  {
    category: 'Emergency Helplines',
    icon: Phone,
    color: 'emergency',
    items: [
      { name: 'Women Helpline (National)', number: '1091', desc: '24/7 emergency helpline for women in distress', available: '24/7' },
      { name: 'Cyber Crime Helpline', number: '1930', desc: 'Report online fraud, harassment, and cybercrime', available: '24/7' },
      { name: 'Police Emergency', number: '100', desc: 'Immediate police assistance', available: '24/7' },
      { name: 'Ambulance', number: '108', desc: 'Medical emergency services', available: '24/7' },
      { name: 'iCall (Mental Health)', number: '9152987821', desc: 'Psychosocial support and counseling', available: 'Mon–Sat 8am–10pm' },
    ],
  },
  {
    category: 'Online Safety & Cybercrime',
    icon: Shield,
    color: 'violet',
    items: [
      { name: 'National Cybercrime Portal', url: 'https://cybercrime.gov.in', desc: 'Report cybercrime, harassment, and stalking online' },
      { name: 'ReportHarm', url: 'https://reportharm.in', desc: 'Report online child sexual abuse and image-based abuse' },
      { name: 'iGoDigital SafeHer', url: 'https://igodigital.in', desc: 'Digital safety resources for women and girls' },
    ],
  },
  {
    category: 'Legal Aid & Support',
    icon: Scale,
    color: 'teal',
    items: [
      { name: 'National Legal Services Authority', url: 'https://nalsa.gov.in', desc: 'Free legal aid and services for women', number: '15100' },
      { name: 'National Commission for Women', url: 'https://ncw.nic.in', desc: 'Statutory body for women\'s rights', number: '7827170170' },
      { name: 'Shakti Shalini (Delhi)', number: '10920', desc: 'Counseling and shelter for women in crisis' },
    ],
  },
  {
    category: 'Shelters & Safe Spaces',
    icon: Heart,
    color: 'pink',
    items: [
      { name: 'Swadhar Greh Scheme', desc: 'Government shelter homes for women in difficult circumstances. Contact your district collector\'s office.' },
      { name: 'One Stop Centres (Sakhi)', number: '181', desc: 'Integrated support for violence-affected women — police, legal, medical, counseling' },
      { name: 'Short Stay Homes', desc: 'Temporary shelter for women and children. Contact your nearest district social welfare office.' },
    ],
  },
]

const colorMap: Record<string, string> = {
  emergency: 'bg-emergency-50 dark:bg-emergency-950/30 border-emergency-200 dark:border-emergency-800/50',
  violet: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50',
  teal: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/50',
  pink: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/50',
}

const iconColorMap: Record<string, string> = {
  emergency: 'text-emergency-600 dark:text-emergency-400 bg-emergency-100 dark:bg-emergency-950/50',
  violet: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/50',
  teal: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/50',
  pink: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/50',
}

export default function ResourcesPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[--text-secondary]" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[--text-primary]">Emergency Resources</h1>
          <p className="text-sm text-[--text-secondary]">Helplines, legal aid, and support organizations</p>
        </div>
      </div>

      {/* Emergency strip */}
      <div className="card mb-6 p-5 bg-emergency-50 dark:bg-emergency-950/30 border border-emergency-200 dark:border-emergency-800/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-emergency-600 dark:text-emergency-400" />
          <h2 className="font-display font-bold text-emergency-700 dark:text-emergency-300">If you are in immediate danger</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Police', number: '100' },
            { label: 'Women Helpline', number: '1091' },
            { label: 'Ambulance', number: '108' },
            { label: 'Cyber Crime', number: '1930' },
          ].map(item => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-black/20 border border-emergency-200 dark:border-emergency-800/50 hover:bg-emergency-100 dark:hover:bg-emergency-900/30 transition-colors text-center"
              id={`call-${item.number}`}
            >
              <Phone className="w-5 h-5 text-emergency-600 dark:text-emergency-400" />
              <span className="text-lg font-display font-black text-emergency-700 dark:text-emergency-300">{item.number}</span>
              <span className="text-xs text-emergency-600/80 dark:text-emergency-400/80">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Resources sections */}
      <div className="space-y-6">
        {resources.map(section => {
          const Icon = section.icon
          return (
            <div key={section.category} className="card overflow-hidden">
              <div className={`px-6 py-4 border-b border-[--border] flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColorMap[section.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-display font-bold text-[--text-primary]">{section.category}</h2>
              </div>
              <div className="divide-y divide-[--border]">
                {section.items.map((item, i) => (
                  <div key={i} className="px-6 py-4 hover:bg-[--bg-secondary] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[--text-primary]">{item.name}</p>
                        <p className="text-xs text-[--text-muted] mt-0.5">{item.desc}</p>
                        {'available' in item && (
                          <span className="badge-teal text-xs mt-1.5">{item.available}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {'number' in item && item.number && (
                          <a
                            href={`tel:${item.number}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[--bg-secondary] hover:bg-violet-50 dark:hover:bg-violet-950/30 text-xs font-semibold text-[--text-primary] hover:text-violet-600 transition-colors"
                            id={`call-resource-${item.number}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {item.number}
                          </a>
                        )}
                        {'url' in item && item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[--bg-secondary] hover:bg-violet-50 dark:hover:bg-violet-950/30 text-xs font-semibold text-violet-600 dark:text-violet-400 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Safety tip */}
      <div className="card p-5 mt-6 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">Save These Numbers</p>
            <p className="text-xs text-violet-600/80 dark:text-violet-400/80 leading-relaxed">
              Save the Women Helpline (1091) and Cyber Crime (1930) numbers in your phone so you have them available even without data connectivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
