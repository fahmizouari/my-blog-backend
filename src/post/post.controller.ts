import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, Res, Header, HttpCode, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  
  @Get('download')
  @HttpCode(201)
  async downloadPosts(@Res() res) {
    var listPosts =await this.postService.findAll();
    const createPostsPDF = await this.postService.createPostsPDF(listPosts);
    res.header('Content-Type','application/pdf');
    res.setHeader('Access-Control-Expose-Headers','Content-Disposition');
    res.header('Content-Disposition','attachment; fileName='+createPostsPDF.name);
    return res.send(createPostsPDF.pdf);
  
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request) {    


    console.log("request.user")
    console.log(request.user)
    return this.postService.findAll();
  }




  @Get(':index/:per')
  findPerPagination(@Param('index') index: number,@Param('per') per: number) {
    return this.postService.findPerPagination(+index,+per);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }




  @Post("addCronJob")
  addCronJob(@Body() body, @Res() res) {
    var response= this.postService.addCronJob(body.name,body.seconds);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      lastDate: response,
  });
  }

  @Post("deleteCronJob")
  deleteCronJob(@Body() body, @Res() res) {
    var response= this.postService.deleteCronJob(body.name);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      lastDate: response,
  });
  }
}
