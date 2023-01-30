import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

const Project = () => {
    const {id} = useParams()
    const [project, setProjects] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [typeMessage, setTypeMessage] = useState()

    useEffect(() =>{
       setTimeout(() =>{
        fetch(`http://localhost:5000/projects/${id}`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((resp) => resp.json())
        .then((data) =>{
            setProjects(data)
            setServices(data.services)
        })
        .catch((err) =>console.error(err))
       }, 200)
    }, [id])

    function editPost(project){
        setMessage('')
        if(project.budget < project.cost){
            setMessage('Orçamento não pode menor que o custo do projeto!')
            setTypeMessage('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method:"PATCH",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(project),
        }).then(resp => resp.json())
        .then((data) => {
            setProjects(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado!')
            setTypeMessage('success')
        })
        .catch(err => console.log(err))
    }
    function createService(project){

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        
        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setTypeMessage('error')
            project.services.pop()
            return false
        }
        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        }).then((resp) => resp.json())
        .then((data) => {
            //exibir os servços
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }
    function removeService(id, cost){
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id //pega o serviço certo a ser deletado
        )
        const projectUpdated = project

        projectUpdated.services = servicesUpdated //tira o serviço do projeto
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost) // tira o preço do serviço

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json())
        .then((data) => {
            setProjects(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso! ')
            setTypeMessage('success')
        })
        .catch(err => console.log(err))
    }
    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }
    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

  return (
    <>
        {project.name ? (
        <div className={styles.projectDetails}>
            <Container customClass='column'>
                {message && <Message type={typeMessage} msg={message}/>}
                <div className={styles.datailsContainer}>
                    <h1>Projeto: {project.name}</h1>
                    <button onClick={toggleProjectForm} className={styles.btn}>
                        {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                    </button>
                    {!showProjectForm ? (
                        <div className={styles.projectInfo}>
                            <p><span>Categoria:</span> {project.category.name}</p>
                            <p><span>Total de Orçamento:</span> R${project.budget}</p>
                            <p><span>Total Utilizado:</span> R${project.cost}</p>
                        </div>
                    ) : (
                        <div className={styles.projectInfo}>
                            <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project}/>
                        </div>
                    )}
                </div>
                <div className={styles.serviceFormContainer}>
                    <h2>Adicione um serviço:</h2>
                    <button onClick={toggleServiceForm} className={styles.btn}>
                        {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                    </button>
                    <div className={styles.projectInfo}>
                        {
                            showServiceForm && (
                                <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviço"
                                    projectData={project}
                                />
                            )
                        }
                    </div>
                </div>
                <h2>Serviços</h2>
                <Container customClass='start'>
                    {services.length > 0 && 
                        services.map((service) => (
                            <ServiceCard
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                            />
                        ))
                    }
                    {services.length === 0 && <p>Não hé serviços cadastrados</p>}
                </Container>
            </Container>
        </div>
        ): (
            <Loading/>
        )}
    </>
  )
}

export default Project