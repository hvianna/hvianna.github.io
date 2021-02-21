---
layout: default
title: FFmpeg
parent: Video tools
grand_parent: Notes and bookmarks
nav_order: 1
---

# FFmpeg

## Codificação H.264 e HEVC

| parâmetro | descrição |
|--|--|
| `-c:v` | codec de vídeo: `libx264` para H.264; `libx265` para H.265 / HEVC |
| `-c:a` | codec de áudio: `aac`, `ac3`, `pcm_s16le`, `pcm_s24le`, `flac` |
| `-vf` | filtro de vídeo: `yadif` para *deinterlace* |
| `-preset` | `faster`, `fast`, `medium`, `slow`, `slower` ( > velocidade > tamanho de arquivo ) |
| `-crf` | `0` = lossless; `51` = pior qualidade - default: `28` para x265; `23` para x264 |

### Transcode de vídeo entrelaçado para x.264 progressivo e áudio PCM 24 bits
```
ffmpeg -i "concat:e:00004.m2ts|e:00005.m2ts|e:00003.m2ts" -vf yadif -c:v libx264 -preset slow -crf 23 -c:a pcm_s24le w:output.mkv
```

### Transcode de vídeo entrelaçado para x.264 progressivo com múltiplas streams de áudio reordenadas
```
ffmpeg -i "concat:e:VTS_01_1.VOB|e:VTS_01_2.VOB|e:VTS_01_3.VOB" -map 0:1 -map 0:3 -map 0:2 -vf yadif -c:v libx264 -preset slow -crf 23 -c:a:0 copy -c:a:1 pcm_s16le x:output.mkv
```

> Stream mapping:
> + *Stream #0:0 (menu) discarded*
> + Stream #0:1 -> #0:0 (mpeg2video (native) -> h264 (libx264))
> + Stream #0:3 -> #0:1 (copy)
> + Stream #0:2 -> #0:2 (pcm_dvd (native) -> pcm_s16le (native))

Ver também [Listar streams de um arquivo](#listar-streams-de-um-arquivo)

### Gerando vídeo a partir de um conjunto de imagens
```
ffmpeg -r 29.97 -i "%06d.png" -pix_fmt yuv420p -c:v libx265 -crf 28 output.mp4
```

IMPORTANTE: a extensão `.mp4` possibilita a geração de *timestamps* corretos para posterior multiplexação com áudio.

parâmetro | descrição
--|--
`-pix_fmt` | [Chroma subsampling format](https://trac.ffmpeg.org/wiki/Chroma%20Subsampling)
`-r` | Frame rate (deve vir **antes** do `-i`)

As imagens devem ser numeradas sequencialmente, sem interrupções, a partir de zero (ou utilize o parâmetro `-start_number`).
A string de formatação deve especificar a largura correta quando os números forem formatados com zeros à esquerda, caso contrário é possível utilizar apenas `%d`.

Ver [documentação relacionada](http://www.ffmpeg.org/faq.html#toc-How-do-I-encode-single-pictures-into-movies_003f).


### Copiando capítulos de um arquivo de entrada
```
ffmpeg -i input.mkv -map_chapters 0 -c copy -c:v libx264 -preset slow -crf 23 -c:a copy output.mkv
```

parâmetro | descrição
--|--
`-map_chapters` | índice do arquivo de entrada (se houver apenas um arquivo de entrada, o índice pode ser omitido)

---

Documentação relacionada:
+ [Codificação H.265](https://trac.ffmpeg.org/wiki/Encode/H.265)
+ [Codificação H.264](https://trac.ffmpeg.org/wiki/Encode/H.264)
+ [Filtros](https://ffmpeg.org/ffmpeg-filters.html)
+ [Map](https://trac.ffmpeg.org/wiki/Map)
+ [Advanced options](http://ffmpeg.org/ffmpeg.html#Advanced-options)

## Seeking / splitting

| parâmetro | descrição |
|--|--|
| `-ss hh:mm:ss.ddd` | define a posição de início da leitura |
| `-to hh:mm:ss.ddd` | define a posição de fim da leitura |
| `-t hh:mm:ss.ddd` | define a **duração** da leitura - mutualmente exclusivo com `-to` |

Quando o parâmetro `-ss` é informado **antes** da entrada, o ffmpeg se baseia nos keyframes do arquivo de entrada e decodifica apenas os frames necessários para o posicionamento exato. Com o parâmetro `ss` **após** a entrada, o ffmpeg irá decodificar e descartar todos os frames até o ponto desejado.

> "Note that if you specify -ss before -i only, the timestamps will be reset to zero, so -t and -to have the same effect."

---

### Copiar três minutos a partir do início do arquivo
```
ffmpeg -ss 00:00:00 -t 00:03:00 -i input.mp4 -vcodec copy -acodec copy intro.mp4
```

### Extrair um trecho no intervalo especificado
```
ffmpeg -ss 0:51:22 -i input.m2ts -ss 0:51:22.712 -to 0:55:18.281 -c:v copy -c:a pcm_s24le ch12.mkv
```
---

Documentação FFmpeg:
+ [Main options](https://ffmpeg.org/ffmpeg.html#toc-Main-options)
+ [Seeking with FFmpeg](http://trac.ffmpeg.org/wiki/Seeking)



## Concatenar entrada

+ **Concat Protocol** - para arquivos de entrada com o **mesmo codec** e alguns *containers* (Transport Streams) [(Documentação)](https://trac.ffmpeg.org/wiki/Concatenate#protocol):
```
ffmpeg -i "concat:00004.m2ts|00005.m2ts|00003.m2ts" -c:v libx264 -preset slow -crf 23 -c:a pcm_s24le w:output.mkv
```


+ **Concat Demuxer** - para arquivos com o **mesmo codec** e qualquer *container* [(Documentação)](https://trac.ffmpeg.org/wiki/Concatenate).

+ **Concat Filter** - para arquivos de entrada com **codecs diferentes**, mas mesmo *frame size* e *frame rate* [(Documentação)](https://trac.ffmpeg.org/wiki/Concatenate#differentcodec):
```
ffmpeg -i 0001.m2ts -i 0002.m2ts -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -c:v libx264 -preset slow -crf 20 -c:a pcm_s24le output.mkv
```

---

[Documentação FFmpeg](https://trac.ffmpeg.org/wiki/Concatenate)

## Mux / demux / subs

### Listar streams de um arquivo

```
ffprobe input.m2ts
```
> Stream #0:0[0x1011]: Video: hevc (Main 10) (HDMV / 0x564D4448), yuv420p10le, 3840x2160 [SAR 1:1 DAR 16:9], 23.98 fps<br>
> Stream #0:1[0x1015]: Video: hevc (Main 10) (HDMV / 0x564D4448), yuv420p10le, 1920x1080 [SAR 1:1 DAR 16:9], 23.98 fps<br>
> Stream #0:2[0x1100]: Audio: truehd (AC-3 / 0x332D4341), 48000 Hz, 7.1, s32 (24 bit)<br>
> Stream #0:3[0x1100]: Audio: ac3 (AC-3 / 0x332D4341), 48000 Hz, 5.1(side), fltp, 640 kb/s<br>
> Stream #0:4[0x1101]: Audio: eac3 (AC-3 / 0x332D4341), 48000 Hz, 7.1, fltp, 1664 kb/s<br>
> Stream #0:5[0x1102]: Audio: ac3 (AC-3 / 0x332D4341), 48000 Hz, 5.1(side), fltp, 640 kb/s

### Extrair streams selecionadas sem recodificar

```
ffmpeg -i input.m2ts -map 0:0 -map 0:2 -c:v:0 copy -c:a:0 copy output.m2ts
```
> Stream mapping:
> + Stream #0:0 -> #0:0 (copy)
> + Stream #0:2 -> #0:1 (copy)

> **A ordem das opções `-map` define a ordem das streams no arquivo de saída:**

```
ffprobe output.m2ts
```
> Stream #0:0: Video: hevc (Main 10) (HDMV / 0x564D4448), yuv420p10le, 3840x2160 [SAR 1:1 DAR 16:9], q=2-31, 23.98 fps<br>
> Stream #0:1: Audio: truehd (AC-3 / 0x332D4341), 48000 Hz, 7.1, s32 (24 bit)


### Multiplexar streams elementares

*atenção para a extensão das streams - o ffmpeg não reconhece .m4v*
```
ffmpeg -i input.h264 -i input.aac -vcodec copy -acodec copy output.mp4
```

### Multiplexar áudio e vídeo de arquivos de entrada diferentes

Verificar o número de cada stream de entrada com:
```
ffmpeg -i nee.mp4 -i nee.vob
```
> Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'nee.mp4':
> + **Stream #0:0**(und): Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p, 3840x2160, 190795 kb/s, 59.94 fps, 59.94 tbr, 60k tbn, 119.88 tbc (default)
> + Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 93 kb/s (default)<br>
> Input #1, mpeg, from 'nee.vob':
> + Stream #1:0[0x1bf]: Data: dvd_nav_packet
> + Stream #1:1[0x1e0]: Video: mpeg2video (Main), yuv420p(tv, top first), 720x480 [SAR 8:9 DAR 4:3], 29.97 fps, 29.97 tbr, 90k tbn, 59.94 tbc
> + **Stream #1:2**[0xa0]: Audio: pcm_dvd, 48000 Hz, stereo, s16, 1536 kb/s

```
ffmpeg -i nee.mp4 -itsoffset -0.9 -i nee.vob -map 0:0 -map 1:2 -c:v copy -c:a pcm_s16le nee.mkv
```

| parâmetro | descrição |
|--|--|
| `-itsoffset` | ajusta o delay - usar **antes** do arquivo de entrada com a stream a ajustar ([time duration syntax](https://ffmpeg.org/ffmpeg-utils.html#time-duration-syntax)) |


### Adicionar legendas a um vídeo
```
ffmpeg -i input.mp4 -i subs.srt -c copy -c:s mov_text output.mp4
```

### Demultiplexar apenas uma stream específica
```
ffmpeg -i input.mp4 -an -sn -vcodec copy output.h264
ffmpeg -i input.mp4 -vn -sn -acodec copy output.aac
ffmpeg -i input.mp4 -vn -an -scodec srt output.srt
```

---

**demux.bat:**
```
@echo off
IF [%1]==[] (
	ECHO Informe o nome do arquivo a demultiplexar!
	exit /b
)

ffmpeg -i %1 -c:v copy -map 0:0 "%~n1.h264" -c:a copy -map 0:1 "%~n1.aac" -c:s srt -map 0:2 "%~n1.srt"
```

## Converter para GIF animada

### Gerar palette

```
ffmpeg -y -i input.mp4 -filter:v "crop=560:264:0:120" -vf fps=15,palettegen palette.png
```

### Converter

#### com crop:

```
ffmpeg -y -i input.mp4 -i palette.png -filter_complex "crop=560:264:0:120,fps=15,paletteuse" output.gif
```

#### com resize:

```
ffmpeg -ss 30 -t 3 -i input.mp4 -i palette.png -filter_complex
"fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif
```

#### Referências:

+ [https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality](https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality)
+ [http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html](http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html)
+ [https://video.stackexchange.com/questions/4563/how-can-i-crop-a-video-with-ffmpeg](https://video.stackexchange.com/questions/4563/how-can-i-crop-a-video-with-ffmpeg)

## Áudio

### Converter áudio para FLAC
```
ffmpeg -i vts_01_1.vob -c flac -compression_level 8 ouput.flac
```

### Converter áudio de blu-ray para PCM 24 bits
```
ffmpeg -i 00002.m2ts -c:v copy -c:a pcm_s24le -ss 0:51:22.712 -to 0:55:18.281 "LOVE ME DO.mkv"
```

### Resampling de áudio
```
ffmpeg -i input.mp4 -vcodec copy -acodec aac -b:a 320k -ar 44100 output.mp4
```

+ `-ar` = sampling rate (Hz)
+ `-b:a` = bitrate (bps)

#### Referências

+ [https://trac.ffmpeg.org/wiki/Encode/AAC](https://trac.ffmpeg.org/wiki/Encode/AAC)
