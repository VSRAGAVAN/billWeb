import { Box, Typography, useTheme } from '@mui/material'

const Footer = () => {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          fontSize: '0.875rem',
          fontWeight: 500
        }}
      >
        © {currentYear} Developed, Made with ❤️ by V S RAGAVAN
      </Typography>
    </Box>
  )
}

export default Footer
