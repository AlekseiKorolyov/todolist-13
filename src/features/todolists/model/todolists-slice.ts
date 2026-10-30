import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    fetchTodolistAC: create.reducer<Todolist[]>((_state, action) => {
      // 5
      return action.payload.map((tl) => ({ ...tl, filter: "all" }))
    }),
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const newTodolist: DomainTodolist = {
          title,
          filter: "all",
          id: nanoid(),
          addedDate: "",
          order: 1,
        }
        return {
          payload: newTodolist,
        }
      },
      (state, action) => {
        state.push(action.payload)
      },
    ),
  }),
})

export const fetchTodolistsTC = createAsyncThunk(
  `${todolistsSlice.name}/fetchTodolistsTC`,
  async (_arg, { dispatch }) => {
    const res = await todolistsApi.getTodolists()
    dispatch(fetchTodolistAC(res.data))
    return res.data
  },
)

export const { createTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, deleteTodolistAC, fetchTodolistAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

// export type Todolist = {
//   id: string
//   title: string
//   filter: FilterValues
// }

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
