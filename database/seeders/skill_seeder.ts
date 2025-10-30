import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Skill from '#models/skill'
import data from '#database/data'

export default class SkillSeeder extends BaseSeeder {
  async run() {
    const skills = data.skills

    await Skill.truncate()

    await Skill.createMany(skills)
  }
}
