import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Profile.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const [apiKey, setApiKey] = useState('');
  const [about, setAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingApiKey, setIsEditingApiKey] = useState(false);
  const [customModels, setCustomModels] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomModels();
      const storedAbout = localStorage.getItem('about');
      if (storedAbout) {
        setAbout(storedAbout);
      }
    }
  }, [isAuthenticated]);

  const fetchCustomModels = () => {
    axios.get('https://cortex-rnd0.onrender.com/user_models')
      .then(response => {
        setCustomModels(response.data.models);
      })
      .catch(error => {
        console.error('There was an error fetching the custom models!', error);
      });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
  };

  const handleSubmitAbout = () => {
    setIsEditing(false);
    localStorage.setItem('about', about);
    toast.success('About section updated successfully!');
  };

  const handleEditAbout = () => {
    setIsEditing(true);
  };

  const handleSubmitApiKey = () => {
    axios.post('https://cortex-rnd0.onrender.com/update_api_key', {
      email: user.email,
      api_key: apiKey
    })
    .then(response => {
      toast.success('API key updated successfully!');
      setIsEditingApiKey(false);
    })
    .catch(error => {
      console.error('Error updating API key:', error);
      toast.error('Failed to update API key.');
    });
  };

  const handleEditApiKey = () => {
    setIsEditingApiKey(true);
  };

  const handleLogout = () => {
    logout({ returnTo: 'https://cortex-sable.vercel.app/' });
  };

  return (
    <div className='profile-page'>
      <ToastContainer />
      <nav>
        <ul className="icon-list">
          <div className="list">
            <div className="list1">
              <li>
                <Link to="/home">
                  <HomeOutlinedIcon sx={{ width: "40px", color: "gray", '&:hover': { color: 'white' } }} />
                </Link>
              </li>
            </div>
            <div className="list2">
              <li>
                <Link to="/playground">
                  <SmartToyIcon sx={{ color: "gray", '&:hover': { color: 'white' } }} />
                </Link>
              </li>
              <li>
                <AccountCircleOutlinedIcon />
              </li>
            </div>
          </div>
        </ul>
      </nav>
      <div className='profile-container'>
        {isAuthenticated && (
          <div className='profile-details'>
            <div className='profile-left'>
              <div className='profile-photo'>
                {user.picture && (
                  <img src={user.picture} alt="Profile" />
                )}
              </div>
              <div className='api-key-section'>
                <label htmlFor="apiKey">Enter your API key:</label>
                {isEditingApiKey ? (
                  <div>
                    <input
                      type="password"
                      id="apiKey"
                      name="apiKey"
                      value={apiKey}
                      onChange={handleApiKeyChange}
                    />
                    <button className='api-submit-btn' onClick={handleSubmitApiKey}>Submit</button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="password"
                      id="apiKey"
                      name="apiKey"
                      value={apiKey}
                      disabled
                    />
                    <button className='api-edit-btn' onClick={handleEditApiKey}>Edit</button>
                  </div>
                )}
                <p>This API key can be used for accessing specific services or APIs.</p>
              </div>
              <div className='user-details'>
                <p>Name: {user.name}</p>
                <p>Nickname: {user.nickname}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
            <div className='profile-right'>
              <div className='about-section'>
                <h3>About</h3>
                {isEditing ? (
                  <div>
                    <textarea
                      value={about}
                      onChange={handleAboutChange}
                      placeholder="Tell us about yourself..."
                    />
                    <button className='about-submit-btn' onClick={handleSubmitAbout}>Submit</button>
                  </div>
                ) : (
                  <div>
                    <ReactMarkdown>{about}</ReactMarkdown>
                    <button className='about-edit-btn' onClick={handleEditAbout}>Edit</button>
                  </div>
                )}
              </div>
              <div className='custom-models-section'>
                <h3>Your Custom Models</h3>
                <ul>
                  {customModels.map((model, index) => (
                    <li key={index}>{model.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
