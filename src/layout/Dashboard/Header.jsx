import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API imports
import {
  getUserProfile,
  uploadProfilePicture,
  fetchProfilePicture,
  changePassword,
} from 'utils/ApiService';

// fallback image
import Img2 from 'assets/images/user/avatar-2.png';

export default function Header() {
  const navigate = useNavigate();

  // Profile modal
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password modal
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch profile
  const handleProfileOpen = async () => {
    setShowProfile(true);
    setLoading(true);
    try {
      const data = await getUserProfile();
      const mappedProfile = {
        ...data?.payLoad,
        profilePictureFile: data?.payLoad?.profilePicture || null,
      };
      setProfile(mappedProfile);
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  // Load profile picture whenever profile changes
  useEffect(() => {
    if (profile?.profilePictureFile) {
      const loadProfilePicture = async () => {
        try {
          const url = await fetchProfilePicture(profile.profilePictureFile);
          setProfilePicUrl(url);
        } catch (err) {
          console.error('Failed to fetch profile picture', err);
          setProfilePicUrl(Img2);
        }
      };
      loadProfilePicture();
    } else {
      setProfilePicUrl(Img2);
    }
  }, [profile]);

  // Handle password change
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password do not match!');
      return;
    }
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      toast.success('Password changed successfully!');
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handle profile picture upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadProfilePicture(selectedFile);

      // Refresh profile
      const updatedProfile = await getUserProfile();
      const mappedProfile = {
        ...updatedProfile?.payLoad,
        profilePictureFile: updatedProfile?.payLoad?.profilePicture || null,
      };
      setProfile(mappedProfile);
      setSelectedFile(null);

      // Show success toast
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to update profile picture.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="pc-header">
        <div className="header-wrapper">
          <div className="ms-auto">
            <Nav className="list-unstyled">
              <Dropdown className="pc-h-item" align="end">
                <Dropdown.Toggle
                  className="pc-head-link arrow-none me-0"
                  variant="link"
                  id="user-profile-dropdown"
                >
                  <i className="ph ph-user-circle" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-user-profile pc-h-dropdown p-0 overflow-hidden">
                  <Dropdown.Header className="bg-primary">
                    <Stack direction="horizontal" gap={3} className="my-2">
                      <div className="flex-shrink-0">
                        <Image
                          src={profilePicUrl || Img2}
                          alt="user-avatar"
                          className="user-avatar wid-35"
                          roundedCircle
                        />
                      </div>
                      <Stack gap={1}>
                        <h6 className="text-white mb-0">
                          {localStorage.getItem('role') || ''}
                        </h6>
                        <span className="text-white text-opacity-75">
                          {localStorage.getItem('signupEmail') || ''}
                        </span>
                      </Stack>
                    </Stack>
                  </Dropdown.Header>

                  <div className="dropdown-body">
                    <Dropdown.Item
                      onClick={handleProfileOpen}
                      className="justify-content-start"
                    >
                      <i className="ph ph-user me-2" />
                      Profile
                    </Dropdown.Item>

                    <Dropdown.Item
                      as={Link}
                      to="#"
                      onClick={() => setShowModal(true)}
                      className="justify-content-start"
                    >
                      <i className="ph ph-lock-key me-2" />
                      Change Password
                    </Dropdown.Item>

                    <div className="d-grid my-2">
                      <Button
                        onClick={() => {
                          localStorage.clear();
                          navigate('/');
                        }}
                      >
                        <i className="ph ph-sign-out align-middle me-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <Modal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        centered
      >
        <Modal.Body className="p-2 text-center">
          {loading ? (
            <p>Loading...</p>
          ) : profile ? (
            <>
              <Image
                src={profilePicUrl || Img2}
                roundedCircle
                className="mb-3"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />

              {/* <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <Button
                  className="mt-2"
                  variant="primary"
                  disabled={!selectedFile || uploading}
                  onClick={handleUpload}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div> */}

              <h4 className="fw-bold text-uppercase">
                {profile.firstName} {profile.lastName}
              </h4>

              <div className="mt-3 text-start">
                <div className="border rounded p-3 mb-2 shadow-sm">
                  <p className="fw-semibold mb-1">
                    <i className="ph ph-map-pin me-2" /> Address
                  </p>
                  <p className="mb-0">{profile.address || 'N/A'}</p>
                </div>

                <div className="border rounded p-3 mb-2 shadow-sm">
                  <p className="fw-semibold mb-1">
                    <i className="ph ph-phone me-2" /> Contact
                  </p>
                  <p className="mb-0">{profile.phoneNumber || 'N/A'}</p>
                </div>

                <div className="border rounded p-3 shadow-sm">
                  <p className="fw-semibold mb-1">
                    <i className="ph ph-envelope me-2" /> Email
                  </p>
                  <p className="mb-0">{profile.emailId}</p>
                </div>
              </div>

              <div className="border rounded p-3 mb-3 shadow-sm text-start">
                <Form.Label className="fw-semibold mb-2">Upload Profile Picture</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="primary"
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>





            </>
          ) : (
            <p>No profile data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProfile(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Password Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
