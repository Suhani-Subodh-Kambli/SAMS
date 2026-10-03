import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getActivityById, updateActivity } from '../../api/activityApi';

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', organizer: '', date: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getActivityById(id).then(data => {
      if(data) {
        setFormData({
          title: data.title,
          category: data.category,
          description: data.description || '',
          organizer: data.organizer,
          date: data.date
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateActivity(id, formData);
    setSaving(false);
    navigate('/student/activities');
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Edit Activity</h1>
      <p className="text-muted" style={{marginBottom: '24px'}}>Update your activity details.</p>
      
      <div className="card" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
              <option value="Academic">Academic</option>
              <option value="Technical">Technical</option>
              <option value="Internship">Internship</option>
              <option value="Certification">Certification</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Volunteering">Volunteering</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Organizer / Institution</label>
            <input type="text" name="organizer" className="form-control" value={formData.organizer} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange}></textarea>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Activity'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/student/activities')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivity;
