# Bundle item 166_energy_pre52 (thread "Videos: Energy committee meetings", 22 Nov 2569)

Routine content under AUTO UPDATES (video, auto-approved). Data + media only, no design change. **Time-sensitive: the meeting is Tue 24 Nov 2569, 15.00 Bangkok.**

## What it does
- Adds the PRE-meeting video for Energy committee meeting 52/2569 (Tue 24 Nov 2569, 15.00-17.00, room CA 427) to parliamentx.com/energy/2569 (#read-52): 2:25, 1080x1920, Thai voice + English subtitles burned in, kind="pre", label วิดีโอก่อนการประชุม.
- Surgical, like items 110/120: replaces only the "media" field of meeting 52 in the DATA line of energy/2569/index.html and in meetings.json, adds the Thai CAPS track (52p), makes s/v-52-pre.html + its card (video_share.py, CARD_BIG=1), re-applies no_video_dl, refreshes the home newest-4 video list and the Energy 2569 snapshot "v".
- Ends with video_offload + video_host_check (mp4 goes to the video repos, never stays on the main site).

## Self-contained
One file. v52pre.mp4 (5,584,530 bytes), v52pre.th.vtt and poster52pre.jpg are embedded as base64 tar.gz after __PAYLOAD_BELOW__ and sha256-checked before use. Nothing is read from the shared folder except archive/build tools.

## Needs first
Item 165_edu_env_energy_nov22 (adds the meeting 52 date card). Without it the script stops with "meeting 52|2026-11-24 not on the page".

## Sources and legal
- Notice ที่ สว (กมธ ๑) ๐๐๐๗/ว๑๐๔๓ dated 19 Nov 2569, senate.go.th ref 11216654, Rpublic=1.
- "Work so far" scene: press summary of meeting 50 (10 Nov 2569), Rpublic=1, plus summaries 48-50 for the subcommittee/working-group chairs.
- Legal check: STOP 0, WARN 0. No private names, no company names; extra bodies named only by their official names. Pack PDF is kept on local disk with the master (shared folder over cap).

## Tests
On origin/main 13fd7d7f + items 142, 143, 144, 165 applied:
- Two runs gave the same tree (385aa736...), second run "changed 0 text files".
- no_video_dl --check PASS; after seo.py apply the older share pages differ only by uploadDate (shallow-clone artefact).

md5 of the .sh: 2d9bc2a053fc6e8facc81f24b2392a1f

STATUS: READY
