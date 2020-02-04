const express = require('express')
const server = express()
server.use(express.json())


//array que Armazena os projetos digitados
const projects = []

//variavel para contagem de requisições do server
let requisicoes = 0

//midleware para checar se existe o ID requisitado, se não existir
//a rota será interrompida retornando um erro de bad request
function pesquisaId(req, res, next) {

  const { id } = req.params
  const pesquisar = projects.find(projects => projects.id == id)

  if (pesquisar) {
    return next()
  }
  else {

    console.log("ID não existe")
    return res.status(400).json({ error: 'Projeto não existe!' })
  }

}

//midleware global que conta quantas requisições o sistema gerou
server.use((req, res, next) => {

  requisicoes++
  console.log(` Foram feitas ${requisicoes} requisições`)

  return next()

})

//rota para cadastro de projeto
server.post('/projects', (req, res) => {
  const projeto = {
    "id": req.body.id,
    "title": req.body.title,
    "task": []
  }
  projects.push(projeto)
  res.send(projeto)

})

//rota para exibir todos os projetos
server.get('/projects', (req, res) => {

  res.send(projects)

})

//rota para editar os projetos
server.put('/projects/:id', pesquisaId, (req, res) => {
  const {id} = req.params
  const { title } = req.body

  const editar = projects.find(projects => projects.id == id)

  editar.title = title

  res.send({ message: "editado" })

})

//rota para deletar projetos
server.delete('/projects/:id', pesquisaId, (req, res) => {
  const pesquisa = req.params.id

  const deletar = projects.findIndex(projects => projects.id == pesquisa)

  projects.splice(deletar, 1)

  res.send(projects)

})

//rota que adiciona tarefas aos projetos

server.post("/projects/:id/tasks",pesquisaId,(req,res)=>{
  
  const {id} = req.params
  const { task } = req.body

  const editar = projects.find(projects => projects.id == id)


  editar.task.push(task)
  res.send(projects)
  
})

server.listen(3000)