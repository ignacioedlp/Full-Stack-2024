import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { checkAbilites } from '../common/decorators/abilities.decorator';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { GetToken } from 'src/common/decorators/get-token.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @checkAbilites({ action: 'read', subject: 'Task' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  @checkAbilites({ action: 'read', subject: 'Task' })
  async getTaskById(@Param('id') id: string) {
    const taskFound = await this.taskService.getTaskById(Number(id));
    if (!taskFound) throw new NotFoundException('Task not found');
    return taskFound;
  }

  @Post()
  @checkAbilites({ action: 'read', subject: 'Task' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  async createTask(@Body() data: CreateTaskDto, @GetToken() token: any) {
    return this.taskService.createTasks(data, token.sub);
  }

  @Put(':id')
  @checkAbilites({
    action: 'manage',
    subject: 'Task',
    conditions: true,
  })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  async updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    try {
      return this.taskService.updateTask(Number(id), data);
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  @Delete(':id')
  @checkAbilites({ action: 'delete', subject: 'Task' })
  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  async deleteTask(@Param('id') id: string) {
    try {
      return await this.taskService.deleteTask(Number(id));
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
