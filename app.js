import express from 'express'
import knex from 'knex'
import bodyParser from 'body-parser'
import path from 'path'

const app = express()
app.use(bodyParser.json())

const port = 3000

//* to use the file names as the path in the browser
app.use(express.static(path.join('.', '/static/')))

app.get('/api/employees', async (request, response) => {
    const employees = await data_base.raw("select * from company")
    employees.rows = employees.rows.map(e => {
        e.address = e.address.trimEnd()
        return e
    })
    response.status(200).json(employees.rows)
})

app.get('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    const employee = await data_base.raw(`select * from company where id = ${id}`)
    employee.rows = employee.rows.map(e => {
        e.address = e.address.trimEnd()
        return e
    })
    response.status(200).json()
})

app.post('/api/employees', async (request, response) => {
    const new_employee = request.body
    await data_base.raw(`INSERT INTO company (name,age,address,salary) VALUES (?, ?, ?, ?);`,
        [new_employee.name, new_employee.age, new_employee.address, new_employee.age])
    response.status(201).json({result: "new employee created"})
})

app.put('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    const employee = request.body
    await data_base.raw(`UPDATE company SET name =?, age =?, address =?, salary =? WHERE id = ${id};`,
        [employee.name, employee.age, employee.address, employee.salary])
    response.status(200).json({result: "employee updated"})
})

app.delete('/api/employees/:id', async (request, response) => {
    const id = request.params.id
    await data_base.raw(`DELETE FROM company WHERE id = ${id};`)
    response.status(200).json({result: "employee deleted"})
})

app.post('/api/create-table', async (request, response) => {
    await data_base.raw(`create table public.company (id bigserial primary key, name text, age integer, address text, salary integer);`)
    response.status(201).json({status: "table-created"})
})

app.post('/api/employees-init', async (request, response) => {
    await data_base.raw(`
    INSERT INTO public.company (name,age,address,salary) VALUES
    ('Vasilij Nobokov',60,'Proletarskaya 20',25550.0),
    ('Fedul Alexandrovich',70,'Sadovaya 8',28000.0),
    ('Rodeon Sergeevich',50,'Mira 55',30000.0),
    ('Metrophan Kandratevich',80,'Lenina 5',35000.0),
    ('Metrophan Andreevich',80,'Lenina 6',35000.0),
    ('Rodeon Agafiev',90,'Bolshevikov 2',10000.0),
    ('Kimmchy',29,'Japan',29000),
    ('Peter Kandratevich',20,'Zheleznaya 666',202000);
`)
    response.status(201).json({result: "Table initialized with data"})
})

app.delete('/api/delete-table', async (request, response) => {
    await data_base.raw(`drop table public.company;`)
    response.status(200).json({status: "table-deleted"})
})

app.listen(port, () => {
    console.clear()
    console.log(`Express server started on port ${port}`)
})

const data_base = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'ecom'
    }
})

