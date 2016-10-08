/**
 * Created by hzq on 16-7-30.
 */
/*
CREATE TABLE IF NOT EXISTS  brief_sixrooms_2016_07_29 as
SELECT room_id,
    COUNT(room_id),
    room_name,
    owner_uid,
    nickname,
    game_name,
    face,
    tags,
    AVG(score) AS score,
    AVG(fans) AS avgFans,
    AVG(online) AS avgOnline,
    MAX(fans) AS maxFans,
    MAX(online) AS maxOnline,
    "sixrooms" AS platform
FROM orignal_sixrooms_2016_07_29
GROUP BY room_id
ORDER BY AVG(score) DESC;*/
