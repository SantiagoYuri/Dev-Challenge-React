import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Info from '@mui/icons-material/Info'

import { api } from './services/api'

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function App() {
  const [data, setData] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [fetchIndex, setFetchIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setUser] = useState(null)

  const handleOpen = index => {
    setIsOpen(true)
    setUser(users.find((_, i) => i === index))
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const fetchData = async () => {
    const { data } = await api.get('/?results=50')

    return data
  }

  useEffect(() => {
    fetchData().then(data => {
      const dataMap = data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        gender: user.gender,
        phone: user.phone
      }))

      setUsers(dataMap)
      setData(dataMap)
    })
  }, [])

  useEffect(() => {
    fetchData().then(data => {
      const dataMap = data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        gender: user.gender,
        phone: user.phone
      }))

      setUsers(prev => [...prev, ...dataMap])
      setData(prev => [...prev, ...dataMap])
    })
  }, [fetchIndex])

  useEffect(() => {
    const filter = users.filter(user => user.name.includes(search))

    if (search === '') {
      setData(users)
      return
    }

    setData(filter)
  }, [search])

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item lg="12">
          <TextField
            hiddenLabel
            fullWidth
            id="filled-hidden-label-normal"
            defaultValue=""
            placeholder="Procurar"
            onChange={e => {
              setSearch(e.target.value)
            }}
          />
        </Grid>
        <Grid item lg="12">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Gênero</TableCell>
                <TableCell align="right">Telefone</TableCell>
                <TableCell align="right">Informação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((user, i) => (
                <TableRow key={user.name}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell align="right">{user.gender}</TableCell>
                  <TableCell align="right">{user.phone}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleOpen(i)}>
                      <Info />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {selectedUser && (
              <Box sx={boxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {selectedUser.name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Gênero
                </Typography>
                <Typography variant="h6">{selectedUser.gender}</Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Telefone
                </Typography>
                <Typography variant="h6">{selectedUser.phone}</Typography>
              </Box>
            )}
          </Modal>
        </Grid>
        <Grid item lg="12" justifyItems="center">
          <Button
            variant="contained"
            onClick={() => setFetchIndex(prev => prev + 1)}
          >
            Carregar mais
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
