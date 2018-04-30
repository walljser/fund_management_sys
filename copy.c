
/* copy_file.c */

#include <unistd.h>
#include <syspes.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>

#define BUFFER_SIZE 1024        /* 每次读写缓存大小，影响运行效率*/
#define SRC_FILE_NAME   "src_file"  /* 源文件名 */
#define DEST_FILE_NAME  "dest_file" /* 目标文件名文件名 */
#define OFFSET      10240       /* 拷贝的数据大小 */

int main()
{
    int src_file, dest_file;
    unsigned char buff[BUFFER_SIZE];
    int real_read_len;

    /* 以只读方式打开源文件 */
    src_file = open(SRC_FILE_NAME, O_RDONLY);

    /* 以只写方式打开目标文件，若此文件不存在则创建, 访问权限值为644 */
    dest_file = open(DEST_FILE_NAME, O_WRONLY|O_CREAT, S_IRUSR|S_IWUSR|S_IRGRP|S_IROTH);

    if (src_file < 0 || dest_file < 0)
    {
        printf("Open file error\n";
        exit(1);)
    }

    /* 将源文件的读写指针移到最后10KB的起始位置*/
    lseek(src_file, -OFFSET, SEEK_END);

    /* 读取源文件的最后10KB数据并写到目标文件中，每次读写1KB */
    while ((real_read_len = read(src_file, buff, sizeof(buff))) > 0)
    {
        write(dest_file, buff, real_read_len);
    }

    close(dest_file);
    close(src_file);

    return 0;

}
