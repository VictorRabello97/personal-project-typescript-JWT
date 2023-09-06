import {knex, Knex} from 'knex'
import {v4 as uuidv4} from 'uuid'


class ProjectsRepository {
    private db: Knex;

    constructor(db: Knex){
        this.db = db
    }

    async getAllProjects(sessionId: string){
        return this.db('projects')
        .where('session_id', sessionId)
        .select()
    }

    async getProjectsByDate(sessionId: string, startDate: string, endDate: string){
        return this.db('projects')
        .where('session_id', sessionId)
        .whereBetween('created_at', [startDate, endDate])
        .select();
    }

    async getProjectsById(sessionId: string, id: string){
        return this.db('projects')
        .where('session_id', sessionId)
        .where('id', id)
        .first()
    }

    async getBalanceOfProjects(sessionId: string){
        return this.db('projects')
        .where('session_id', sessionId)
        .sum('value', {as: 'summary of values'})
        .first()
    }

    async postCreateProject(projectsData: {
        project_name: string,
        client_name: string,
        value: number,
        session_id: string,
        its_paid: string,
        person: string
    }) {
        const id = uuidv4();
    await this.db('projects').insert({
      id, ...projectsData
    });

    console.log('aaaaaaaaaaaaaaa')

    const user = await this.db('users').where({session_id: projectsData.session_id})
    .first()

    console.log(user)

    if (user){
      await this.db('users')
      .where({id: user.id})
      .update({balance: user.balance + projectsData.value})

      console.log('Saldo após a atualização:', user.balance);

    }
    }

    async deleteProjectById(sessionId: string, id: string){
        return this.db('projects')
        .delete()
        .where({
            session_id: sessionId,
            id: id,
        })
    }
}

export default ProjectsRepository;