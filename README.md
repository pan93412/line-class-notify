# line-class-notify

Notify anything about your class on your LINE.

## Usage

### Make a School Table

It should be formed in:

```csv
week,chap,start,end,course
[Week],[Chapter],[Start Time],[End Time],[Course Name]
```

Example:

```csv
week,chap,start,end,course
1,1,08:00,08:55,數學
1,2,09:00,09:55,國文
1,3,10:00,10:55,資訊
1,4,11:00,11:05,體育
1,5,12:05,13:00,間隔時間
```

## Configure

Copy a `.env.example`, fill in the information,
and rename it to `.env`.

### Running

```zsh
yarn
yarn start # better to run this on screen or tmux
```

## Author

(C) pan93412, 2021.
