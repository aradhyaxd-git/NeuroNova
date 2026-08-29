import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUserCircle, HiClock, HiAcademicCap, HiTag, HiPencilSquare, HiCheck, HiSparkles, HiTrophy } from 'react-icons/hi2';

export default function LearnerProfileCard({ profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setEditing(false);
  };

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!tempProfile.interests?.includes(newTag)) {
        setTempProfile({
          ...tempProfile,
          interests: [...(tempProfile.interests || []), newTag]
        });
      }
      e.target.value = '';
    }
  };

  const removeInterest = (tagToRemove) => {
    setTempProfile({
      ...tempProfile,
      interests: (tempProfile.interests || []).filter(t => t !== tagToRemove)
    });
  };

  return (
    <div className="profile-section-wrapper">
      <div className="section-header-compact">
        <span className="badge-pill"><HiSparkles /> LEARNER INTELLIGENCE ENGINE</span>
        <h2 className="section-title-md">Learner Intelligence Profile</h2>
        <p className="section-sub-text">Personalized cognitive parameters guiding AI path generation.</p>
      </div>

      <motion.div layout className="profile-card card-surface glow-border">
        <div className="profile-card-header">
          <div className="profile-identity">
            <div className="avatar-icon-wrap"><HiUserCircle /></div>
            <div className="profile-titles-group">
              <h3>{profile.goal || 'Master Full-Stack AI Engineering'}</h3>
              <span className="level-badge-pill">{profile.experienceLevel || 'Intermediate'} Learner</span>
            </div>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => editing ? handleSave() : setEditing(true)}>
            {editing ? <><HiCheck /> Save Profile</> : <><HiPencilSquare /> Edit Parameters</>}
          </button>
        </div>

        {editing ? (
          <div className="profile-edit-form">
            <div className="form-group">
              <label>Primary Target Objective / Skill Goal</label>
              <input
                type="text"
                value={tempProfile.goal || ''}
                onChange={(e) => setTempProfile({ ...tempProfile, goal: e.target.value })}
                placeholder="e.g. Master System Design & Distributed Systems"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Experience Level</label>
                <select
                  value={tempProfile.experienceLevel || 'Intermediate'}
                  onChange={(e) => setTempProfile({ ...tempProfile, experienceLevel: e.target.value })}
                >
                  <option value="Beginner">Beginner (Foundations)</option>
                  <option value="Intermediate">Intermediate (Practitioner)</option>
                  <option value="Advanced">Advanced (Mastery)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weekly Commitment (Hours/Week)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={tempProfile.weeklyHours || 6}
                  onChange={(e) => setTempProfile({ ...tempProfile, weeklyHours: parseInt(e.target.value) || 6 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Target Career Outcome</label>
              <input
                type="text"
                value={tempProfile.targetOutcome || ''}
                onChange={(e) => setTempProfile({ ...tempProfile, targetOutcome: e.target.value })}
                placeholder="e.g. Senior Software Engineer / AI Architect"
              />
            </div>

            <div className="form-group">
              <label>Core Focus Areas & Topics (Press Enter to add)</label>
              <div className="tags-editable-box">
                {(tempProfile.interests || []).map((interest, idx) => (
                  <span key={idx} className="tag-chip editable">
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)}>&times;</button>
                  </span>
                ))}
                <input type="text" placeholder="+ Add topic..." onKeyDown={handleAddInterest} className="add-tag-input" />
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-stats-grid">
            <div className="info-stat-card">
              <div className="stat-icon-wrap purple"><HiAcademicCap /></div>
              <div className="stat-text-block">
                <span className="stat-label">Current Experience</span>
                <strong className="stat-value">{profile.experienceLevel || 'Intermediate'}</strong>
              </div>
            </div>

            <div className="info-stat-card">
              <div className="stat-icon-wrap emerald"><HiClock /></div>
              <div className="stat-text-block">
                <span className="stat-label">Weekly Commitment</span>
                <strong className="stat-value font-mono">{profile.weeklyHours || 6} hrs / week</strong>
              </div>
            </div>

            <div className="info-stat-card">
              <div className="stat-icon-wrap amber"><HiTrophy /></div>
              <div className="stat-text-block">
                <span className="stat-label">Target Career Outcome</span>
                <strong className="stat-value">{profile.targetOutcome || 'Senior Technical Role'}</strong>
              </div>
            </div>

            <div className="info-stat-card full-width">
              <div className="stat-icon-wrap rose"><HiTag /></div>
              <div className="stat-text-block flex-1">
                <span className="stat-label">Validated Topic Focus Areas</span>
                <div className="tags-wrap">
                  {(profile.interests || ['React', 'Node.js', 'System Design']).map((topic, i) => (
                    <span key={i} className="tag-chip">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
