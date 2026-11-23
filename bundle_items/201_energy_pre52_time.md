# Bundle item 201_energy_pre52_time (thread "Videos: Energy committee meetings", 23 Nov 2569)

Routine content under AUTO UPDATES (correction of a live, auto-approved video). No design change. **Time-sensitive: the meeting is Tue 24 Nov 2569 at 15.30 Bangkok (08:30 UTC).**

## Why
The Senate replaced the meeting 52 notice (same number ว๑๐๔๓, dated 19 Nov 2569; new file ref 11236375, Rpublic=1). The only change is the time: 15.30-17.30 (was 15.00-17.00). Date, room CA 427 and agenda are unchanged. Same pattern as item 120 (meeting 51).

## What it does
- Replaces the live Energy PRE 52 video with the corrected re-render (opening scene re-recorded; Thai voice, on-screen card and burned-in English all say 15.30-17.30). New length 2:26 (was 2:25), 1080x1920, kind="pre".
- Surgical, like 120/168: only meeting 52's "media" field in energy/2569/index.html DATA + meetings.json, the CAPS track 52p, s/v-52-pre.html and its card, then the home newest-4 list/snapshot. video_offload REPLACEs the hosted v52pre.mp4 (sha1 differs).
- Does not touch the meeting 52 date card text (the Edu/Env/Energy site thread fixes that as item 202).

## Self-contained
One file. v52pre.mp4 (5,638,290 bytes), v52pre.th.vtt and poster52pre.jpg ride as base64 tar.gz after __PAYLOAD_BELOW__, sha256-checked before use.

## Tests
On origin/main 20302351 (video clones at main): two runs gave the same tree (7fadf85e...), the second run changed 0 text files; data_match PASS. Legal check on the video: STOP 0, WARN 0.

md5 of the .sh: 50fd6159718ae0ff0bbbc0429a665959

STATUS: READY
