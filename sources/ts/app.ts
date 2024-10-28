import '../style/main.scss'
import { User } from '../interfaces/users'

//class with triggers to call searchUser method if input value is not empty
class Users {
  private _data: User[] | [] = []
  private _search: HTMLInputElement
  constructor(users: User[], input: HTMLInputElement) {
    this._data = users
    this._search = input
  }

  get data(): User[] {
    return this._data
  }

  set data(newUsers: User[]) {
    this._data = newUsers
    this.onDataChange()
  }

  set search(string: string) {
    this._search.value = string
    this.onDataChange()
  }

  private onDataChange(): void {
    clearTableBody()
    if (this._search.value) {
      return searchUsers(this._search.value)
    }
    this._data.forEach(user => renderUsers(user))
  }
}

//class & input initialization
const filterInput = document.getElementById('filterInput') as HTMLInputElement
const users = new Users([], filterInput)

//event to set input value
filterInput.addEventListener('input', (event: Event) => {
  const target = event.target as HTMLInputElement
  users.search = target.value
})

//creating of headers for table
function createTableHeaders(user: any): void {
  const thead = document.getElementById('tableHead') as HTMLTableSectionElement
  const headerRow = document.createElement('tr')

  function addHeaders(obj: any, parentKey: string = ''): void {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const fullKey = `${parentKey}.${key}` ?? key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return addHeaders(value, fullKey)
      }
      const th = document.createElement('th')
      th.innerText = formatHeader(key)
      if (key === 'firstname' || key === 'lastname' || key === 'id') {
        th.classList.add('sortable')
        th.onclick = () => sortUsers(key as keyof User, th)
      }
      headerRow.appendChild(th)
    })
  }

  addHeaders(user)

  const actionTh = document.createElement('th')
  actionTh.innerText = 'Actions'
  headerRow.appendChild(actionTh)

  thead.appendChild(headerRow)
}

//formating header because some of them can look like data.data(with dot)
function formatHeader(key: string): string {
  const parts = key.split('.')
  return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1)
}

//sorting data
function sortArray<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return array.sort((a, b) => {
    const fieldA = a[key]
    const fieldB = b[key]

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return order === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA)
    }

    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return order === 'asc' ? fieldA - fieldB : fieldB - fieldA
    }

    return 0 // like a default value
  })
}

//sorting our users
const sortUsers = (key: keyof User, th: HTMLTableCellElement): void => {
  const toggledElements = document.getElementsByClassName('active')
  const order = th.classList.contains('active') ? 'asc' : 'desc'
  Array.from(toggledElements).forEach(el => el.classList.toggle('active'))
  if (order === 'desc') {
    th.classList.toggle('active')
  }
  users.data = sortArray(users.data, key as keyof User, order)
}

//filtering our users by search
const searchUsers = (query: string): void => {
  const filtered = users.data.filter(user =>
    user.firstname.toLowerCase().includes(query.toLowerCase()) ||
    user.lastname.toLowerCase().includes(query.toLowerCase())
  )

  filtered.forEach(user => renderUsers(user))
}

//clearing the table, need after each render(except first)
function clearTableBody(): void {
  const tbody = document.getElementById('userTableBody') as HTMLTableSectionElement
  tbody.innerHTML = ''
}

//rendering our users
function renderUsers(user: User): void {
  const tbody = document.getElementById('userTableBody') as HTMLTableSectionElement
  const mainRow = document.createElement('tr')

  function addData(obj: any, parentKey: string = ''): void {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const fullKey = parentKey ? `${parentKey}.${key}` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        addData(value, fullKey)
      } else {
        const td = document.createElement('td')

        if (fullKey === 'login.registered') {
          td.innerText = formatDate(value)
        } else {
          td.innerText = value ? value.toString() : ''
        }

        mainRow.appendChild(td)
      }
    })
  }

  addData(user)

  const actionTd = document.createElement('td')
  const deleteButton = document.createElement('button')
  deleteButton.className = 'btn btn-danger'
  deleteButton.innerText = 'Delete'
  deleteButton.onclick = () => deleteRow(user.id, mainRow)
  actionTd.appendChild(deleteButton)
  mainRow.appendChild(actionTd)

  tbody.appendChild(mainRow)
}

//deleting user
async function deleteRow(userId: number, rowElement: HTMLTableRowElement): Promise<void> {
  const confirmation = confirm(`Are you sure you want to delete user with ID ${userId}?`)
  if (confirmation) {
    try {
      const response = await fetch(`https://jsonplaceholder.org/users/${userId}`, {
        method: 'Delete',
      })

      if (response.ok) {
        const index = users.data.findIndex(user => user.id === userId)
        users.data.splice(index, 1)
        rowElement.remove()
        alert(`User with ID ${userId} was deleted successfully.`)
      } else {
        alert('Failed to delete the user. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('An error occurred while deleting the user.')
    }
  }
}

//formating date to become yyyy--mm--dd
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

//fetching our data
const fetchUsers = async (): Promise<void> => {
  try {
    const response = await fetch('https://jsonplaceholder.org/users')
    users.data = await response.json()

    createTableHeaders(users.data[0])
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

//init
fetchUsers()