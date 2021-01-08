---
category: blog
title: Running GStreamer on Mac (+ how to use xcode)
description: A blog post on how to set up and run GStreamer on Mac with Xcode
date: 2021-01-08T09:56:53.653Z
tags:
  - Setup
published: true
cover: gstreamer_logo.png
---
![Blog Post Thumbnail](gstreamer_logo.png)

## What is GStreamer?

GStreamer is a library for constructing graphs of media-handling components. The applications it supports range from simple Ogg/Vorbis playback, audio/video streaming to complex audio (mixing) and video (non-linear editing) processing.

## Setting up and running GStreamer on macOS Big Sur (Version 11.1) with Xcode version 12.3

1. Install the latest version of GStreamer from GStreamer website (https://gstreamer.freedesktop.org/)

* It does not include tutorials (/Library/Frameworks/GStreamer.framework/Current/share/gst-sdk/tutorials does not exist, unlike what the instruction suggests)
* Download the tutorials directly from https://gitlab.freedesktop.org/gstreamer/gst-docs/examples/tutorials

2. Let's run tutorial 1. First, create new project in Xcode. Choose C programming language with command line tools option. Do not just open /gst-docs/examples/tutorials/xcode/Tutorials.xcodeproj because it would not work. Couple things to do

* In **Xcode > Build Settings > Header Search Paths > Debug**, add /Library/Frameworks/GStreamer.framework/Headers
* In **Xcode > General > Frameworks and Libraries**, add /Library/Frameworks/GStreamer.framework and drag&drop /Library/Frameworks/GStreamer.framework/Versions/1.0/lib/libgstnet-1.0.0.dylib from Finder. I did not include the dylib file and struggled with the error

3. In **Xcode > Build Phases > Embed Frameworks**, uncheck **Code Sign on Copy**. Also, in **Xcode > Signing & Capabilities**, click "+ Capability" in the top left corner and choose "Hardened Runtime". Then turn on "Disable Library Validation" in the list. Otherwise, I encountered the error "Command CodeSign failed with a nonzero exit code".
4. Do not directly copy & paste tutorial 1 Hello world! example in GStreamer website. The problem was I can only hear the audio but not the video. In order to open the video as a new pop-up window when running on xcode, I had to modify the original code and add the following three lines at the appropriate lines.

```c
GMainLoop *main_loop;
main_loop = g_main_loop_new (NULL, FALSE);
g_main_loop_run (main_loop);
```

The full tutorial 1 code is below

```c
//
//  main.c
//  gstreamer-tutorials
//
//  Created by Wung Jae Lee on 1/8/21.
//

#include <gst/gst.h>

int main(int argc, char * argv[]) {
    // insert code here...
    GMainLoop *main_loop;
    GstElement *pipeline;
    GstBus *bus;
    GstMessage *msg;
    
    /* Initalize GStreamer */
    gst_init(&argc, &argv);
    
    /* Build the pipeline */
    pipeline = gst_parse_launch("playbin uri=https://www.freedesktop.org/software/gstreamer-sdk/data/media/sintel_trailer-480p.webm", NULL);
    
    main_loop = g_main_loop_new(NULL, FALSE);
    
    /* Start playing */
    gst_element_set_state(pipeline, GST_STATE_PLAYING);
    g_main_loop_run(main_loop);
    /* Wait until error or EOS */
    bus = gst_element_get_bus(pipeline);
    msg = gst_bus_timed_pop_filtered(bus, GST_CLOCK_TIME_NONE, GST_MESSAGE_ERROR | GST_MESSAGE_EOS);
    
    /* Free resources */
    if (msg != NULL)
        gst_message_unref(msg);
    gst_object_unref(bus);
    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(pipeline);
    return 0;
}
```

Tadaa! You are good to go. You should be able to see the video and hear the audio nicely.

### Stack overflow posts that helped me

https://gitlab.freedesktop.org/gstreamer/gst-docs/-/issues/66

https://stackoverflow.com/questions/58195914/xcode-11-command-codesign-failed-with-a-nonzero-exit-code

https://stackoverflow.com/questions/59253591/xcode-11-2-1-command-codesign-failed-with-a-nonzero-exit-code

https://stackoverflow.com/questions/35137165/gstreamer-1-0-video-from-tutorials-is-not-playing-on-macos
