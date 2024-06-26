import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ScienceIcon from '@mui/icons-material/Science';
import DrawIcon from '@mui/icons-material/Draw';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import ExploreIcon from '@mui/icons-material/Explore';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './Chat.css'; // Import the CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GroupChat = () => {
  const { modelNames } = useParams(); // Extract modelNames from route parameters
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const fetchChatHistory = () => {
    // Implement fetching chat history if needed
    // Example:-
    // axios.get(`http://localhost:5000/chat_history/${modelNames}`)
    //   .then(response => {
    //     setChatHistory(response.data.chatHistory);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching chat history:', error);
    //   });
  };

  const handleSendMessage = () => {
    if (message.trim() === '') {
      setChatHistory((prev) => [
        ...prev,
        { userMessage: 'Message cannot be empty.', modelResponses: [] },
      ]);
      return;
    }

    // Ensure modelNames is defined and formatted correctly
    if (!modelNames || typeof modelNames !== 'string') {
      setChatHistory((prev) => [
        ...prev,
        { userMessage: message, modelResponses: ['Yikes! Brain hiccup. The server is being moody. Retry in a bit'] },
      ]);
      return;
    }

    const namesArray = modelNames.split(',');
    namesArray.map((name) => name.toLowerCase().trim());

    if (namesArray.some((name) => !name)) {
      setChatHistory((prev) => [
        ...prev,
        { userMessage: message, modelResponses: ['Yikes! Brain hiccup. The server is being moody. Retry in a bit'] },
      ]);
      return;
    }

    setIsLoading(true);

    axios
      .post('https://cortex-rnd0.onrender.com/group_chat', {
        model_names: namesArray,
        message,
      })
      .then((response) => {
        console.log('Group chat response:', response.data);
        const newMessage = {
          userMessage: message,
          modelResponses: response.data.responses.map((response) =>
            response.replace(/TERMINATE/g, '')
          ), // Remove the word "TERMINATE"
        };
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          newMessage,
        ]);
        setMessage(''); // Clear message input after sending
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        setChatHistory((prev) => [
          ...prev,
          { userMessage: message, modelResponses: ['Yikes! Brain hiccup. The server is being moody. Retry in a bit'] },
        ]);
        setIsLoading(false);
      });
  };

  const formatModelNameForDisplay = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) ; // Replace underscores with spaces
  };

  const getModelIcon = (name) => {
    if (name) {
      switch (name.toLowerCase()) {
        case 'personal_trainer':
          return <FitnessCenterIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'investment_advisor':
          return <ShowChartIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'scientist':
          return <ScienceIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'writer':
          return <DrawIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'news_editor':
          return <NewspaperIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'wellness_consultant':
          return <LocalHospitalIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'event_coordinator':
          return <EventIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'travel_coordinator':
          return <ExploreIcon style={{ color: 'white', marginRight: '20px' }} />;
        case 'creative_content_strategists':
          return <FaceRetouchingNaturalIcon style={{ color: 'white', marginRight: '20px' }} />;
        // Add cases for other models as needed
        default:
          return <AutoAwesomeIcon style={{ color: 'white', marginRight: '20px' }} />;
      }
    }
  };

  return (
    <div className="single">
      <Link to="/home">
        <ArrowBackIcon style={{ position: 'absolute', top: '40px', left: '80px', fontSize: '2.8rem',color: 'white', }}/>
      </Link>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          textAlign: 'center',
          paddingTop: '30px',
          fontFamily: 'Manrope',
          fontWeight: '400',
          color: 'white',
        }}
      >
        Group Chat with {formatModelNameForDisplay(modelNames.replace(',', ', '))}
      </Typography>

      {/* Chat history */}
      <Box
        className="chat-history"
        ref={chatHistoryRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '20px',
          gap: '20px',
          width: '60%',
          margin: 'auto auto 100px auto', 
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        {chatHistory.map((messageData, index) => (
          <React.Fragment key={index}>
            {/* User message */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-end',
              }}
            >
              <Box
                sx={{
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  padding: '10px',
                  maxWidth: '70%',
                }}
              >
                <Typography variant="body1">{messageData.userMessage}</Typography>
              </Box>
              <AccountCircleIcon sx={{ color: 'white', marginLeft: '10px' }} />
            </Box>
            {/* Model responses */}
            {messageData.modelResponses.map((response, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {getModelIcon(modelNames.split(',')[idx])}
                
                <Box
                  sx={{
                    borderRadius: '24px',
                    background:
                      'linear-gradient(0deg, #7F7F7F 0%, #7F7F7F 100%), rgba(57, 56, 56, 0.50)',
                    mixBlendMode: 'color-dodge',
                    width: '80%',
                    padding: '15px',
                    fontFamily: 'Manrope',
                    color: 'white',
                  }}
                >
                  <ReactMarkdown>{response}</ReactMarkdown>
                </Box>
              </Box>
            ))}
          </React.Fragment>
        ))}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {getModelIcon(modelNames.split(',')[0])}
            <Box
              sx={{
                borderRadius: '24px',
                background:
                  'linear-gradient(0deg, #7F7F7F 0%, #7F7F7F 100%), rgba(57, 56, 56, 0.50)',
                mixBlendMode: 'color-dodge',
                width: '80%',
                padding: '15px',
                fontFamily: 'Manrope',
                color: 'white',
              }}
            >
              <Skeleton count={3} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Message input and send button */}
      <Box className="chat-container">
        <TextField
          fullWidth
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'black',
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'orange',
              borderRadius: '10px',
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'pink',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'pink',
            },
            '& .MuiInputLabel-root': {
              color: 'yellow',
            },
            '& .MuiInputLabel-shrink': {
              color: 'yellow',
            },
            '&::placeholder': {
              color: 'yellow',
            },
            marginTop: '-20px'
          }}
        />
        <Button
          className="send-button"
          onClick={handleSendMessage}
          sx={{ bgcolor: 'transparent', marginLeft: '-80px', marginTop: '-18px', color: "white" }}
        >
          <SendIcon />
        </Button>
      </Box>
    </div>
  );
};

export default GroupChat;
