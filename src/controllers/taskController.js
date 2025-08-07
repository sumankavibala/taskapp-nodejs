import pool from '../../db/index.js';

export const getAllTasks = async(req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tasks`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};

export const getAllTasksWithPagination = async(req,res)=> {
  const role = req.role;
  if(role === 'admin' || role === 'staff') {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const offset = (page -1) * limit;
  
    try {
      const result = await pool.query(
        'SELECT * FROM tasks ORDER BY created_at ASC LIMIT $1 OFFSET $2', [limit,offset]
      )
      const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
      const totalTasks = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalTasks/limit);
  
      res.json({
        isSuccess: true,
        metaData: {
          totalTasks,
          totalPages,
          currentPage: page,
          pageSize: limit
        },
        tasks: result.rows,
      })
    } catch (error) {
      res.status(500).json({isSuccess: false,error: error.message})
    }
  } else {
    res.status(401).json({isSuccess:false, message:'Requested permission missing'})
  }
}

export const createTask = async(req, res)=> {
  const title = req.body.title;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    )
    res.json({isSuccess: true,data:result.rows[0]});
  } catch (error) {
    res.status(500).json({isSuccess: false,error: error.message});
  }
}

export const updateTask = async(req,res) => {
  const {id} = req.params;
  const {title, completed} = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title=$1, completed=$2, updated_at = NOW() WHERE id=$3 RETURNING *',
      [title, completed, id]
    );
    res.json({isSuccess: true,data:result.rows[0]})
    
  } catch (error) {
    res.status(500).json({isSuccess: false,error:error.message})
  }
}

export const deleteTask = async(req,res) => {
  const {id} = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id])
    res.json({isSuccess: true,message: 'Task deleted successfully'})
  } catch (error) {
    res.status(500).json({isSuccess: false,error: error.message})
  }
}