import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addActivity } from '../../api/activityApi';

const AddActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    description: '',
    organizer: '',
    date: ''
  });
  
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addActivity(formData);
      navigate('/student/activities');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add activity. Please ensure all fields are filled.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Add Activity</h1>
      <p className="text-muted" style={{marginBottom: '24px'}}>Record a new academic or extracurricular activity.</p>
      
      <div className="card" style={{maxWidth: '600px'}}>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '16px'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              name="category" 
              className="form-control" 
              value={formData.category} 
              onChange={handleChange}
            >
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
            <input 
              type="text" 
              name="organizer"
              className="form-control" 
              value={formData.organizer}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date" 
              name="date"
              className="form-control" 
              value={formData.date}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className="form-control" 
              rows="4" 
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Activity'}
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

export default AddActivity;
