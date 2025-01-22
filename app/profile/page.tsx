



// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useAuth } from '@/contexts/AuthContext'
// import { supabase } from '@/utils/supabase'
// import ProtectedRoute from '@/components/ProtectedRoute'
// import NavigationBar from '@/components/NavigationBar'
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   Grid,
//   Avatar,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material'
// import { PhotoCamera } from '@mui/icons-material'

// interface UserProfile {
//   id: string
//   email: string
//   full_name: string
//   phone_number?: string
//   company?: string
//   position?: string
//   bio?: string
//   avatar_url?: string
// }

// export default function ProfilePage() {
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [success, setSuccess] = useState('')
//   const [error, setError] = useState('')
//   const [profile, setProfile] = useState<UserProfile>({
//     id: '',
//     email: '',
//     full_name: '',
//     phone_number: '',
//     company: '',
//     position: '',
//     bio: '',
//     avatar_url: '',
//   })

//   const [uploading, setUploading] = useState(false)
//   const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [passwordError, setPasswordError] = useState('')
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [avatarUrl, setAvatarUrl] = useState<string>('')

//   const getAvatarUrl = async (fileName: string) => {
//     try {
//       if (!fileName) return null;
      
//       const { data: { publicUrl } } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(fileName)
      
//       // Verify the URL is accessible
//       const response = await fetch(publicUrl, { method: 'HEAD' })
//       if (!response.ok) {
//         console.error('Avatar URL not accessible:', publicUrl)
//         return null
//       }
      
//       return publicUrl
//     } catch (error) {
//       console.error('Error getting avatar URL:', error)
//       return null
//     }
//   }

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return

//       try {
//         const { data, error } = await supabase
//           .from('users')
//           .select('*')
//           .eq('id', user.id)
//           .single()

//         if (error) throw error

//         if (data) {
//           setProfile({
//             ...data,
//             email: user.email || '',
//           })

//           if (data.avatar_url) {
//             const publicUrl = await getAvatarUrl(data.avatar_url)
//             if (publicUrl) {
//               setAvatarUrl(publicUrl + '?t=' + new Date().getTime()) // Add timestamp to prevent caching
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error)
//         setError('Failed to load profile')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [user])

//   // Function to delete old avatar
//   const deleteOldAvatar = async () => {
//     try {
//       if (!profile.avatar_url) return

//       // Extract filename from URL
//       const oldFileName = profile.avatar_url.split('/').pop()
//       if (!oldFileName) return

//       // List all files in the avatars bucket for this user
//       const { data: files, error: listError } = await supabase.storage
//         .from('avatars')
//         .list(undefined, {
//           search: user?.id || '',
//         })

//       if (listError) throw listError

//       // Delete all old avatar files for this user
//       if (files && files.length > 0) {
//         const filesToDelete = files.map(file => file.name)
//         const { error: deleteError } = await supabase.storage
//           .from('avatars')
//           .remove(filesToDelete)

//         if (deleteError) throw deleteError
//       }
//     } catch (error) {
//       console.error('Error deleting old avatar:', error)
//       // Continue with upload even if delete fails
//     }
//   }

//     // Enhanced file upload with better error handling and type checking
//     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         try {
//           setUploading(true)
//           setError('')
          
//           const file = event.target.files?.[0]
//           if (!file || !user) return
    
//           // Validate file type
//           if (!file.type.startsWith('image/')) {
//             setError('Please upload an image file')
//             return
//           }
    
//           // Validate file size (e.g., 5MB limit)
//           if (file.size > 5 * 1024 * 1024) {
//             setError('File size must be less than 5MB')
//             return
//           }
    
//           // Delete old avatar first if exists
//           if (profile.avatar_url) {
//             await supabase.storage
//               .from('avatars')
//               .remove([profile.avatar_url])
//           }
    
//           // Generate unique filename
//           const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
//           const fileName = `${user.id}-${Date.now()}.${fileExt}`
          
//           // Upload new file
//           const { error: uploadError, data: uploadData } = await supabase.storage
//             .from('avatars')
//             .upload(fileName, file, {
//               upsert: true,
//               cacheControl: '0',
//               contentType: file.type
//             })
    
//           if (uploadError) throw uploadError
    
//           // Get public URL
//           const { data: { publicUrl } } = supabase.storage
//             .from('avatars')
//             .getPublicUrl(fileName)
    
//           // Update user profile with new avatar URL
//           const { error: updateError } = await supabase
//             .from('users')
//             .update({ avatar_url: fileName })
//             .eq('id', user.id)
    
//           if (updateError) throw updateError
    
//           // Update local state with timestamp to prevent caching
//           setAvatarUrl(publicUrl + '?t=' + new Date().getTime())
//           setProfile(prev => ({ ...prev, avatar_url: fileName }))
//           setSuccess('Profile picture updated successfully!')
          
//           // Clear the file input
//           if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//           }
//         } catch (error) {
//           console.error('Error uploading file:', error)
//           setError('Failed to upload profile picture')
//         } finally {
//           setUploading(false)
//         }
//       }





//   // Handle password change
//   const handlePasswordChange = async () => {
//     try {
//       setPasswordError('')
      
//       if (newPassword !== confirmPassword) {
//         setPasswordError('New passwords do not match')
//         return
//       }

//       if (newPassword.length < 6) {
//         setPasswordError('New password must be at least 6 characters')
//         return
//       }

//       const { error } = await supabase.auth.updateUser({
//         password: newPassword
//       })

//       if (error) throw error

//       setSuccess('Password updated successfully!')
//       setPasswordDialogOpen(false)
//       setNewPassword('')
//       setConfirmPassword('')
//     } catch (error) {
//       console.error('Error changing password:', error)
//       setPasswordError('Failed to update password')
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setProfile(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)
//     setError('')
//     setSuccess('')

//     try {
//       const { error } = await supabase
//         .from('users')
//         .update({
//           full_name: profile.full_name,
//           phone_number: profile.phone_number,
//           company: profile.company,
//           position: profile.position,
//           bio: profile.bio,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', user?.id)

//       if (error) throw error

//       setSuccess('Profile updated successfully!')
//     } catch (error) {
//       console.error('Error updating profile:', error)
//       setError('Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     )
//   }
  
//   return (
//     <ProtectedRoute>
//       <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//         <NavigationBar />
        
//         <Container component="main" maxWidth="md" sx={{ mt: 10, mb: 4 }}>
//           <Paper elevation={3} sx={{ p: 4 }}>
//             {/* Status Messages */}
//             {error && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}
//             {success && (
//               <Alert severity="success" sx={{ mb: 2 }}>
//                 {success}
//               </Alert>
//             )}

//             {/* Enhanced Avatar Section */}
//             <Box sx={{ mb: 4, textAlign: 'center' }}>
//               <Avatar
//                 src={avatarUrl}
//                 alt={profile.full_name || 'Profile'}
//                 sx={{
//                   width: 100,
//                   height: 100,
//                   margin: '0 auto 16px',
//                   bgcolor: 'primary.main',
//                   fontSize: '2.5rem'
//                 }}
//                 imgProps={{
//                   onError: (e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.onerror = null; // Prevent infinite loop
//                     target.src = ''; // Clear the src to show fallback
//                   }
//                 }}
//               >
//                 {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
//               </Avatar>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 style={{ display: 'none' }}
//                 onChange={handleFileUpload}
//               />
//               <Button
//                 variant="outlined"
//                 startIcon={<PhotoCamera />}
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={uploading}
//                 sx={{ mb: 2 }}
//               >
//                 {uploading ? 'Uploading...' : 'Change Photo'}
//               </Button>
//             </Box>
//                 {/* Profile Form */}
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     required
//                     fullWidth
//                     label="Full Name"
//                     name="full_name"
//                     value={profile.full_name}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     value={profile.email}
//                     disabled
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Phone Number"
//                     name="phone_number"
//                     value={profile.phone_number || ''}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Company"
//                     name="company"
//                     value={profile.company || ''}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Position"
//                     name="position"
//                     value={profile.position || ''}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={4}
//                     label="Bio"
//                     name="bio"
//                     value={profile.bio || ''}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Box sx={{ display: 'flex', gap: 2 }}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       disabled={saving}
//                     >
//                       {saving ? 'Saving...' : 'Save Changes'}
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       onClick={() => setPasswordDialogOpen(true)}
//                     >
//                       Change Password
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </form>

//             {/* Password Change Dialog */}
//             <Dialog
//               open={passwordDialogOpen}
//               onClose={() => setPasswordDialogOpen(false)}
//             >
//               <DialogTitle>Change Password</DialogTitle>
//               <DialogContent>
//                 {passwordError && (
//                   <Alert severity="error" sx={{ mb: 2 }}>
//                     {passwordError}
//                   </Alert>
//                 )}
//                 <TextField
//                   margin="dense"
//                   label="New Password"
//                   type="password"
//                   fullWidth
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Confirm New Password"
//                   type="password"
//                   fullWidth
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setPasswordDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handlePasswordChange} variant="contained">
//                   Update Password
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             {/* Rest of the form remains the same... */}
//           </Paper>
//         </Container>
//       </Box>
//     </ProtectedRoute>
//   )
// }



'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/utils/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import NavigationBar from '@/components/NavigationBar'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { PhotoCamera } from '@mui/icons-material'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone_number?: string
  company?: string
  position?: string
  bio?: string
  avatar_url?: string
}

interface FileUploadResult {
  fileName: string
  publicUrl: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    email: '',
    full_name: '',
    phone_number: '',
    company: '',
    position: '',
    bio: '',
    avatar_url: '',
  })

  const [uploading, setUploading] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
    setPasswordError('')
  }

  const getAvatarUrl = async (fileName: string): Promise<string | null> => {
    try {
      if (!fileName) return null

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const response = await fetch(publicUrl, { method: 'HEAD' })
      if (!response.ok) {
        console.error(`Avatar URL not accessible: ${publicUrl}. Status: ${response.status}`)
        return null
      }

      return publicUrl
    } catch (error) {
      console.error('Error getting avatar URL:', error instanceof Error ? error.message : error)
      return null
    }
  }

  const deleteOldAvatar = async (userId: string): Promise<void> => {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('avatars')
        .list(undefined, {
          search: userId,
        })

      if (listError) throw listError

      if (files && files.length > 0) {
        const filesToDelete = files.map(file => file.name)
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove(filesToDelete)

        if (deleteError) throw deleteError
      }
    } catch (error) {
      console.error('Error deleting old avatar:', error)
      throw error
    }
  }

  const uploadNewAvatar = async (file: File, userId: string): Promise<FileUploadResult> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '0',
        contentType: file.type
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return { fileName, publicUrl }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages()
    setUploading(true)

    try {
      const file = event.target.files?.[0]
      if (!file || !user) return

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      await deleteOldAvatar(user.id)
      const { fileName, publicUrl } = await uploadNewAvatar(file, user.id)

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: fileName })
        .eq('id', user.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl + '?t=' + new Date().getTime())
      setProfile(prev => ({ ...prev, avatar_url: fileName }))
      setSuccess('Profile picture updated successfully!')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setProfile({
            ...data,
            email: user.email || '',
          })

          if (data.avatar_url) {
            const publicUrl = await getAvatarUrl(data.avatar_url)
            if (publicUrl) {
              setAvatarUrl(publicUrl + '?t=' + new Date().getTime())
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handlePasswordChange = async () => {
    clearMessages()

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters')
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      setPasswordDialogOpen(false)
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordError(error instanceof Error ? error.message : 'Failed to update password')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    clearMessages()

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          company: profile.company,
          position: profile.position,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      setSuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationBar />
        
        <Container component="main" maxWidth="md" sx={{ mt: 10, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Avatar
                src={avatarUrl}
                alt={profile.full_name || 'Profile'}
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
                imgProps={{
                  onError: (e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '';
                  }
                }}
              >
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={profile.phone_number || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={profile.company || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={profile.position || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    name="bio"
                    value={profile.bio || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>

            <Dialog
              open={passwordDialogOpen}
              onClose={() => setPasswordDialogOpen(false)}
            >
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                <TextField
                  margin="dense"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPasswordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange} variant="contained">
                  Update Password
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  )
}