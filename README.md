OpenMoji Glyphs Video
=====================

Convert [frames to video](http://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/) with ffmpeg:

```bash
ffmpeg -r 4 -f image2 -s 1920x1080 -i %05d.png -vcodec libx264 -crf 25  -pix_fmt yuv420p video.mp4
```