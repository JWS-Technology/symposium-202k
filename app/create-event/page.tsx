'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Navbar from '@/components/Navbar';

const Page = () => {
  // 1. Initialize State
  const [formData, setFormData] = useState({
    eventName: '',
    minPlayers: '',
    maxPlayers: '',
    eventType: 'ON_STAGE'
  });

  const [status, setStatus] = useState({ loading: false, message: '' });

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: '' });

    try {
      // Create the JSON payload
      const payload = {
        eventName: formData.eventName,
        minPlayers: Number(formData.minPlayers),
        maxPlayers: Number(formData.maxPlayers),
        eventType: formData.eventType
      };

      // Send POST request
      const response = await axios.post('/api/add-event', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setStatus({ loading: false, message: 'EVENT CREATED SUCCESSFULLY!' });
      console.log('Server Response:', response.data);
      
      // Reset form
      setFormData({
        eventName: '',
        minPlayers: '',
        maxPlayers: '',
        eventType: 'ON_STAGE'
      });

    } catch (error: unknown) { // FIX: Use 'unknown' instead of 'any'
      console.error('Error:', error);
      
      let errorMessage = 'ERROR CREATING EVENT';

      // Check if the error is an AxiosError to safely access response data
      if (axios.isAxiosError(error)) {
        // Now typescript knows 'error' has .response
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        // Fallback for generic JS errors
        errorMessage = error.message;
      }

      setStatus({ 
        loading: false, 
        message: errorMessage
      });
    }
  };

  // --- STYLES ---
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: "'Montserrat', sans-serif",
  };

  const formWrapperStyle: React.CSSProperties = {
    backgroundColor: '#050505',
    padding: '3rem',
    maxWidth: '550px',
    width: '100%',
    border: '1px solid #333',
    borderTop: '4px solid #dc2626',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
    clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    color: '#dc2626',
    fontWeight: '800',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontStyle: 'italic'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#111',
    border: '1px solid #333',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1.2em',
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    marginTop: '1rem',
    backgroundColor: '#dc2626',
    color: '#000',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
    transition: 'transform 0.1s ease',
  };

  return (
    
    <div style={{ ...containerStyle, paddingTop: '80px' }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,900;1,900&display=swap');
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input:focus, select:focus { border-color: #dc2626 !important; }
      `}</style>

      <div style={formWrapperStyle}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', fontStyle: 'italic', color: '#fff', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
          Add <span style={{ color: '#dc2626' }}>Event</span>
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Portal Data Entry
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Event Name</label>
            <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} required placeholder="ENTER TITLE..." style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Min Players</label>
              <input type="number" name="minPlayers" value={formData.minPlayers} onChange={handleChange} required min="1" placeholder="0" style={{...inputStyle, textAlign: 'center'}} />
            </div>
            <div>
              <label style={labelStyle}>Max Players</label>
              <input type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} required min="1" placeholder="0" style={{...inputStyle, textAlign: 'center'}} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Event Category</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange} style={selectStyle}>
              <option value="ON_STAGE">ON_STAGE</option>
              <option value="OFF_STAGE">OFF_STAGE</option>
              <option value="CULTURALS">CULTURALS</option>
            </select>
          </div>

          <button type="submit" disabled={status.loading} style={buttonStyle} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            {status.loading ? 'Processing...' : 'Create Entry'}
          </button>

          {status.message && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: status.message.includes('ERROR') ? '#dc2626' : '#fff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Page;