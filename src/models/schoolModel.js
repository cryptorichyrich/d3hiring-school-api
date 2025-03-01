const db = require('../config/database');

class SchoolModel {
  async initialize() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS teachers_students (
        teacher_email VARCHAR(255) NOT NULL,
        student_email VARCHAR(255) NOT NULL,
        PRIMARY KEY (teacher_email, student_email)
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS students (
        email VARCHAR(255) PRIMARY KEY,
        suspended BOOLEAN DEFAULT FALSE
      )
    `);
  }

  async registerStudents(teacher, students) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      for (const student of students) {
        await connection.query(
          'INSERT IGNORE INTO students (email) VALUES (?)',
          [student]
        );
        
        await connection.query(
          'INSERT INTO teachers_students (teacher_email, student_email) VALUES (?, ?) ON DUPLICATE KEY UPDATE teacher_email=teacher_email',
          [teacher, student]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getCommonStudents(teachers) {
    const [rows] = await db.query(`
      SELECT student_email
      FROM teachers_students
      WHERE teacher_email IN (?)
      GROUP BY student_email
      HAVING COUNT(DISTINCT teacher_email) = ?
      AND student_email NOT IN (SELECT email FROM students WHERE suspended = TRUE)
    `, [teachers, teachers.length]);
    
    return rows.map(row => row.student_email);
  }

  async suspendStudent(student) {
    const [result] = await db.query(
      'INSERT INTO students (email, suspended) VALUES (?, TRUE) ON DUPLICATE KEY UPDATE suspended = TRUE',
      [student]
    );
    return result.affectedRows > 0;
  }

  async getNotificationRecipients(teacher, notification) {
    const mentioned = (notification.match(/@([^\s@]+)/g) || [])
      .map(mention => mention.substring(1));
    
    const [rows] = await db.query(`
      SELECT DISTINCT s.email
      FROM students s
      LEFT JOIN teachers_students ts ON s.email = ts.student_email AND ts.teacher_email = ?
      WHERE s.suspended = FALSE
      AND (ts.teacher_email = ? OR s.email IN (?))
    `, [teacher, teacher, mentioned.length ? mentioned : null]);
    
    return rows.map(row => row.email);
  }
}

module.exports = new SchoolModel();