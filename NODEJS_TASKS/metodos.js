// método para chamar rotas

import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from '../buildRoutePath.js'


const database = new Database()

export const routes = [
    {
        method: 'GET',   //método da rota a ser chamada
        path: buildRoutePath('/tasks'),  //caminho da rota
        handler: (req, res) => {  // função do que a rota deverá fazer ao ser invocada
            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },

    {
        method: 'POST',   //método da rota a ser chamada
        path: buildRoutePath('/tasks'),  //caminho da rota
        handler: (req, res) => {  // função do que a rota deverá fazer ao ser invocada
            const {title, description, } = req.body

            const task = {
                id: randomUUID(),  //sintaxe para gerar chave de ID aleatória única
                title,
                description,
                completedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },

    {
        method: 'DELETE',   //método da rota a ser chamada
        path: buildRoutePath('/tasks/:id' ),  //caminho da rota
        handler: (req, res) => {  // função do que a rota deverá fazer ao ser invocada
            const { id } = req.params
            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(404).end()
              }
        
              database.delete('tasks', id)
        
              return res.writeHead(204).end()
            }
    },

    // {
    //     method: 'PUT',
    //     path: buildRoutePath('/tasks/:id'),
    //     handler: (req, res) =>
    //     {
    //         const { id } = req.params

    //         const { title, description } = req.body  
            
    //     }
    //     if (!task){

    //         return res.writeHead(404).end()
    //     }
    //     const [task] = database.select('tasks', { id })
        
    //     database.update('tasks', id, {
    //         title: title ?? task.title,
    //         description: description ?? task.description,
    //         updatedAt: new Date()
    //     })
    // },

    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'title or description are required' })
        )
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    },


    {
        method: 'PATCH',
        patch: buildRoutePath('/tasks', 'id', 'complete'),
        handler: (req, res) => 
        {
            const tasks = database.patch('tasks')
            
            return res.end(JSON.stringify(tasks))
        }
    }
]