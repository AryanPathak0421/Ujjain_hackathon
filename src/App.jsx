import React, { useState, useEffect } from 'react';
import { 
  Camera, AlertTriangle, Users, Activity, MapPin, Bell, Shield, 
  Eye, Zap, Navigation, Wifi, Play, Pause, RotateCcw, ZoomIn, 
  Volume2, VolumeX, Maximize, Radio, TrendingUp, Clock, Target
} from 'lucide-react';

const StampedePreventionDashboard = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [alerts, setAlerts] = useState([]);
  
  // Mock CCTV camera data with stampede risk assessment
  const [cameras, setCameras] = useState([
    {
      id: 'CAM001',
      name: 'Main Ghat Entrance',
      location: 'Har Ki Pauri - Entry Point',
      status: 'Critical',
      stampedeRisk: 92,
      peopleCount: 3847,
      density: 4.2,
      flowRate: 847,
      direction: 'Converging',
      alertLevel: 'HIGH',
      coordinates: { lat: 29.9457, lng: 78.1642 },
      lastUpdate: '2 seconds ago',
      resolution: '4K',
      nightVision: true,
      ptzCapable: true
    },
    {
      id: 'CAM002', 
      name: 'Sangam Bathing Area',
      location: 'Triveni Sangam - Central',
      status: 'High Risk',
      stampedeRisk: 78,
      peopleCount: 2934,
      density: 3.1,
      flowRate: 623,
      direction: 'Bidirectional',
      alertLevel: 'MEDIUM',
      coordinates: { lat: 25.4358, lng: 81.8463 },
      lastUpdate: '1 second ago',
      resolution: '1080p',
      nightVision: true,
      ptzCapable: true
    },
    {
      id: 'CAM003',
      name: 'Narrow Bridge Passage',
      location: 'Connecting Bridge',
      status: 'Critical',
      stampedeRisk: 89,
      peopleCount: 1567,
      density: 5.8,
      flowRate: 234,
      direction: 'Unidirectional',
      alertLevel: 'HIGH',
      coordinates: { lat: 25.4267, lng: 81.8542 },
      lastUpdate: '3 seconds ago',
      resolution: '4K',
      nightVision: true,
      ptzCapable: false
    },
    {
      id: 'CAM004',
      name: 'Exit Bottleneck Point',
      location: 'Main Exit Gateway',
      status: 'High Risk',
      stampedeRisk: 71,
      peopleCount: 2156,
      density: 2.9,
      flowRate: 445,
      direction: 'Outgoing',
      alertLevel: 'MEDIUM',
      coordinates: { lat: 25.4198, lng: 81.8423 },
      lastUpdate: '1 second ago',
      resolution: '1080p',
      nightVision: false,
      ptzCapable: true
    },
    {
      id: 'CAM005',
      name: 'Stairs Overcrowding Zone',
      location: 'Ghat Steps Area',
      status: 'Medium Risk',
      stampedeRisk: 58,
      peopleCount: 892,
      density: 2.1,
      flowRate: 167,
      direction: 'Downward',
      alertLevel: 'LOW',
      coordinates: { lat: 25.4312, lng: 81.8501 },
      lastUpdate: '4 seconds ago',
      resolution: '1080p',
      nightVision: true,
      ptzCapable: true
    },
    {
      id: 'CAM006',
      name: 'Emergency Pathway',
      location: 'Evacuation Route 1',
      status: 'Safe',
      stampedeRisk: 23,
      peopleCount: 145,
      density: 0.8,
      flowRate: 34,
      direction: 'Clear',
      alertLevel: 'NONE',
      coordinates: { lat: 25.4234, lng: 81.8456 },
      lastUpdate: '2 seconds ago',
      resolution: '1080p',
      nightVision: false,
      ptzCapable: false
    }
  ]);

  // Simulate real-time camera updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(camera => ({
        ...camera,
        stampedeRisk: Math.max(0, Math.min(100, camera.stampedeRisk + (Math.random() - 0.5) * 8)),
        peopleCount: Math.max(0, camera.peopleCount + Math.floor((Math.random() - 0.5) * 100)),
        density: Math.max(0, camera.density + (Math.random() - 0.5) * 0.5),
        flowRate: Math.max(0, camera.flowRate + Math.floor((Math.random() - 0.5) * 50)),
        lastUpdate: `${Math.floor(Math.random() * 5) + 1} seconds ago`
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate stampede risk alerts
  useEffect(() => {
    const highRiskCameras = cameras.filter(cam => cam.stampedeRisk > 85);
    if (highRiskCameras.length > 0) {
      const newAlert = {
        id: Date.now(),
        type: 'STAMPEDE_RISK',
        camera: highRiskCameras[0],
        message: `CRITICAL: High stampede risk detected at ${highRiskCameras[0].name}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'CRITICAL',
        actions: ['Deploy Security', 'Crowd Control', 'Emergency Response', 'Close Entry']
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }
  }, [cameras]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return '#dc2626';
      case 'High Risk': return '#ea580c';
      case 'Medium Risk': return '#ca8a04';
      default: return '#16a34a';
    }
  };

  const getDirectionColor = (direction) => {
    switch(direction) {
      case 'Converging': return { background: '#fee2e2', color: '#991b1b' };
      case 'Bidirectional': return { background: '#fef3c7', color: '#92400e' };
      default: return { background: '#dcfce7', color: '#166534' };
    }
  };

  const CameraFeed = ({ camera, isSelected, onClick }) => {
    const statusColor = getStatusColor(camera.status);
    const directionStyle = getDirectionColor(camera.direction);
    
    return (
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.2s',
          ...(isSelected ? {
            outline: '4px solid #3b82f6',
            transform: 'scale(1.05)'
          } : {})
        }}
        onClick={() => onClick(camera)}
      >
        {/* Camera Header */}
        <div style={{
          background: 'linear-gradient(to right, #1f2937, #111827)',
          color: 'white',
          padding: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} />
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{camera.id}</span>
            </div>
            <div style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500',
              backgroundColor: statusColor,
              color: 'white'
            }}>
              {camera.status}
            </div>
          </div>
          <h3 style={{ fontWeight: '500', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{camera.name}</h3>
          <p style={{ fontSize: '0.75rem', color: '#d1d5db', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{camera.location}</p>
        </div>

        {/* Video Feed Simulation */}
        <div style={{ position: 'relative', backgroundColor: 'black', aspectRatio: '16/9' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, #111827, #1f2937, #000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                border: '4px solid #3b82f6',
                borderTop: 'transparent',
                borderRadius: '9999px',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p style={{ color: 'white', fontSize: '0.875rem' }}>Live Feed</p>
            </div>
          </div>

          {/* Overlay Information */}
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem'
          }}>
            {camera.resolution} • {camera.lastUpdate}
          </div>

          {/* Recording Indicator */}
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <div style={{
              width: '0.5rem',
              height: '0.5rem',
              backgroundColor: '#ef4444',
              borderRadius: '9999px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <span style={{ color: 'white', fontSize: '0.75rem' }}>REC</span>
          </div>

          {/* Stampede Risk Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '0.5rem',
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            Stampede Risk: {camera.stampedeRisk}%
          </div>

          {/* People Count */}
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(37, 99, 235, 0.9)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Users size={12} style={{ marginRight: '0.25rem' }} />
            {camera.peopleCount}
          </div>
        </div>

        {/* Camera Statistics */}
        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: '#4b5563' }}>Density:</span>
              <span style={{ marginLeft: '0.25rem', fontWeight: '500' }}>{camera.density}/m²</span>
            </div>
            <div>
              <span style={{ color: '#4b5563' }}>Flow:</span>
              <span style={{ marginLeft: '0.25rem', fontWeight: '500' }}>{camera.flowRate}/min</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>Movement:</span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: directionStyle.background,
              color: directionStyle.color
            }}>
              {camera.direction}
            </span>
          </div>

          {/* Risk Level Bar */}
          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem' }}>
            <div 
              style={{
                height: '0.5rem',
                borderRadius: '9999px',
                transition: 'all 0.3s',
                width: `${camera.stampedeRisk}%`,
                backgroundColor: camera.stampedeRisk > 80 ? '#dc2626' :
                                camera.stampedeRisk > 60 ? '#ea580c' :
                                camera.stampedeRisk > 40 ? '#ca8a04' : '#16a34a'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Add CSS animations to the page
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #1f2937, #000)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                padding: '0.75rem',
                background: 'linear-gradient(to right, #dc2626, #ea580c)',
                borderRadius: '0.5rem'
              }}>
                <Eye size={32} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Stampede Prevention CCTV Dashboard</h1>
                <p style={{ color: '#d1d5db' }}>Real-time crowd monitoring & stampede risk assessment</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>LIVE</div>
              <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>{new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* System Status */}
          <div style={{
            background: 'linear-gradient(to right, #dc2626, #ea580c)',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  backgroundColor: 'white',
                  borderRadius: '9999px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <span style={{ fontWeight: '500' }}>STAMPEDE MONITORING ACTIVE</span>
              </div>
              <span>Active Cameras: {cameras.length}</span>
              <span>High Risk Zones: {cameras.filter(c => c.stampedeRisk > 70).length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} />
              <span>Emergency Protocols: READY</span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem'
        }}>
          {/* Camera Grid */}
          <div>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <Camera size={24} style={{ marginRight: '0.5rem', color: '#60a5fa' }} />
                  Live Camera Feeds
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#d1d5db' }}>Total Monitored: <span style={{ color: 'white', fontWeight: '500' }}>847,293</span> people</span>
                  <span style={{ color: '#f87171' }}>Critical Zones: <span style={{ fontWeight: '500' }}>{cameras.filter(c => c.stampedeRisk > 85).length}</span></span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                gap: '1rem'
              }}>
                {cameras.map(camera => (
                  <CameraFeed
                    key={camera.id}
                    camera={camera}
                    isSelected={selectedCamera?.id === camera.id}
                    onClick={setSelectedCamera}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Critical Alerts */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Bell size={24} style={{ marginRight: '0.5rem', color: '#f87171' }} />
                Critical Alerts
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '16rem', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>No critical alerts</p>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} style={{
                      backgroundColor: 'rgba(127, 29, 29, 0.5)',
                      border: '1px solid #dc2626',
                      borderRadius: '0.5rem',
                      padding: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500', color: '#fca5a5', fontSize: '0.875rem' }}>{alert.severity}</span>
                        <span style={{ fontSize: '0.75rem', color: '#d1d5db' }}>{alert.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'white', marginBottom: '0.75rem' }}>{alert.message}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {alert.actions.map(action => (
                          <button
                            key={action}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              fontSize: '0.75rem',
                              borderRadius: '0.25rem',
                              transition: 'background-color 0.2s',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stampede Risk Analysis */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={24} style={{ marginRight: '0.5rem', color: '#fb923c' }} />
                Risk Analysis
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', padding: '1rem' }}>
                  <h3 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Overall Risk Level</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1, backgroundColor: '#4b5563', borderRadius: '9999px', height: '0.75rem' }}>
                      <div 
                        style={{
                          height: '0.75rem',
                          borderRadius: '9999px',
                          background: 'linear-gradient(to right, #ef4444, #f97316)',
                          width: `${Math.max(...cameras.map(c => c.stampedeRisk))}%`
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{Math.max(...cameras.map(c => c.stampedeRisk))}%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h3 style={{ fontWeight: '500' }}>High-Risk Zones</h3>
                  {cameras.filter(c => c.stampedeRisk > 70).map(camera => (
                    <div key={camera.id} style={{ backgroundColor: '#374151', borderRadius: '0.25rem', padding: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{camera.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{camera.stampedeRisk}%</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>
                        {camera.peopleCount} people • {camera.density}/m² density
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Controls */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Zap size={24} style={{ marginRight: '0.5rem', color: '#fbbf24' }} />
                Emergency Controls
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{
                  width: '100%',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  <AlertTriangle size={20} style={{ marginRight: '0.5rem' }} />
                  Emergency Broadcast
                </button>
                
                <button style={{
                  width: '100%',
                  backgroundColor: '#ea580c',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c2410c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
                >
                  Activate Crowd Control
                </button>
                
                <button style={{
                  width: '100%',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Deploy Response Teams
                </button>
                
                <button style={{
                  width: '100%',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                >
                  Close Entry Points
                </button>

                <button style={{
                  width: '100%',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                >
                  Open Emergency Exits
                </button>
              </div>
            </div>

            {/* AI Model Status */}
            <div style={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <Activity size={24} style={{ marginRight: '0.5rem', color: '#4ade80' }} />
                AI Model Status
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Stampede Detection:</span>
                  <span style={{ color: '#4ade80', fontWeight: '500' }}>96.8% Accuracy</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Processing Speed:</span>
                  <span style={{ color: '#60a5fa', fontWeight: '500' }}>Real-time</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Model Version:</span>
                  <span style={{ color: 'white', fontWeight: '500' }}>v2.4.1</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Prediction Range:</span>
                  <span style={{ color: '#a78bfa', fontWeight: '500' }}>30-45 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Camera Details Modal */}
        {selectedCamera && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#1f2937',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '56rem',
              width: '100%',
              maxHeight: '100vh',
              overflowY: 'auto'
            }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{selectedCamera.name}</h3>
                    <p style={{ color: '#d1d5db' }}>{selectedCamera.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCamera(null)}
                    style={{ color: '#9ca3af', fontSize: '1.875rem', cursor: 'pointer' }}
                    onMouseOver={(e) => e.target.color = 'white'}
                    onMouseOut={(e) => e.target.color = '#9ca3af'}
                  >
                    ×
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '1.5rem'
                }}>
                  {/* Large Video Feed */}
                  <div>
                    <div style={{
                      position: 'relative',
                      backgroundColor: 'black',
                      aspectRatio: '16/9',
                      borderRadius: '0.5rem',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom right, #111827, #1f2937, #000)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '6rem',
                            height: '6rem',
                            border: '4px solid #3b82f6',
                            borderTop: 'transparent',
                            borderRadius: '9999px',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '1.5rem'
                          }}></div>
                          <p style={{ color: 'white', fontSize: '1.125rem' }}>Live Feed - {selectedCamera.id}</p>
                        </div>
                      </div>

                      {/* Controls Overlay */}
                      <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          <Play size={16} />
                        </button>
                        <button style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          <Volume2 size={16} />
                        </button>
                        <button style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          <Maximize size={16} />
                        </button>
                      </div>

                      {/* PTZ Controls */}
                      {selectedCamera.ptzCapable && (
                        <div style={{
                          position: 'absolute',
                          bottom: '1rem',
                          right: '1rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderRadius: '0.5rem',
                          padding: '0.5rem'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.25rem' }}>
                            <div></div>
                            <button style={{ color: 'white', padding: '0.25rem' }}>↑</button>
                            <div></div>
                            <button style={{ color: 'white', padding: '0.25rem' }}>←</button>
                            <button style={{ color: 'white', padding: '0.25rem' }}>⊙</button>
                            <button style={{ color: 'white', padding: '0.25rem' }}>→</button>
                            <div></div>
                            <button style={{ color: 'white', padding: '0.25rem' }}>↓</button>
                            <div></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Analytics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem', color: '#f87171' }}>Stampede Risk Assessment</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Risk Level:</span>
                          <span style={{ fontWeight: 'bold', color: '#f87171' }}>{selectedCamera.stampedeRisk}%</span>
                        </div>
                        <div style={{ width: '100%', backgroundColor: '#4b5563', borderRadius: '9999px', height: '0.75rem' }}>
                          <div 
                            style={{
                              height: '0.75rem',
                              borderRadius: '9999px',
                              background: 'linear-gradient(to right, #ef4444, #f97316)',
                              width: `${selectedCamera.stampedeRisk}%`
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>
                          Prediction confidence: 94.2%
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Real-time Metrics</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>People Count:</span>
                          <span style={{ fontWeight: '500' }}>{selectedCamera.peopleCount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Crowd Density:</span>
                          <span style={{ fontWeight: '500' }}>{selectedCamera.density} people/m²</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Flow Rate:</span>
                          <span style={{ fontWeight: '500' }}>{selectedCamera.flowRate} people/min</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Movement Pattern:</span>
                          <span style={{ fontWeight: '500' }}>{selectedCamera.direction}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Camera Info</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Resolution:</span>
                          <span>{selectedCamera.resolution}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Night Vision:</span>
                          <span>{selectedCamera.nightVision ? '✓' : '✗'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>PTZ Control:</span>
                          <span>{selectedCamera.ptzCapable ? '✓' : '✗'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Last Update:</span>
                          <span>{selectedCamera.lastUpdate}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button style={{
                        width: '100%',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                      >
                        Emergency Alert
                      </button>
                      <button style={{
                        width: '100%',
                        backgroundColor: '#ea580c',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c2410c'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
                      >
                        Deploy Security
                      </button>
                      <button style={{
                        width: '100%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        Record Incident
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StampedePreventionDashboard;