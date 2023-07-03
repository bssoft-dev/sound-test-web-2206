import { useEffect, useState } from "react";
import { useCtx } from "../context/Context";
import Layout from "../components/Layout/Layout";
import CafeMenuList from "../components/CafeOrder/CafeMenuList";
import RecordingResult from "../components/CafeOrder/RecordingResult";
import CafeOrderRecord from "../components/CafeOrder/CafeOrderRecord";
import { CardHeader, Grid, cardHeaderClasses } from "@mui/material";
import { styled } from "@mui/styles";

export const menuList = ['올타임콜드브루', '(1호점)신촌커피', '바닐라 카페라떼', '카라멜 마끼아또', '스페니쉬 연유 카페라떼', '달고나 카페라떼', '딸기 젤리 밀크티', '23수박주스', '아인슈페너 프라페', '스트로베리 초콜릿 프라페', '요거트 프라페', '블루밍 파인애플 라씨', '20곡 오틀리 라떼', '베이컨 체다 베이글', '멕시칸 파니니', '바베큐치킨 파니니', '떠먹는 티라미수', '떠먹는 아이스 박스', 'P. 뉴욕치즈', 'P. 클래식 가토 쇼콜라', 'P. 레드 벨벳', 'P. 퀸즈 캐롯', '초콜릿 크로캉 롱 슈', '황치즈 마카롱', '청포도 요거트 마카롱', '산딸기 마카롱', '블루베리 마카롱', '벨지안 초콜릿 마카롱']

export const recorderParams = {
  text: "",
  // energy_threshold: [0.01, 0.1],
  start_threshold: 0.01,
  end_threshold: 0.01,
  pause_threshold: 1.0,
  neutral_color: "warning",
  recording_color: "warning",
  icon_name: "microphone",
  icon_size: "3x",
  sample_rate: 16000,
  key: "audio_recorder",
  continuousRecording: false
};

export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({

  [`&.${cardHeaderClasses.root}`]: {
    height: 65,
    '@media (max-width: 600px)': {
      height: 'fit-content'
    },
  },
  [`& .MuiTypography-root`]: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 22,
    '@media (max-width: 600px)': {
      fontSize: 18
    },
  }
}));

export default function CafeOrderTestPage() {
  const context = useCtx();
  const { setTitle } = context;

  const [recordData, setRecordData] = useState(null);
  const handleDataUpdate = (data) => {
    setRecordData(data);
  };

  useEffect(() => {
    setTitle('카페 주문 테스트');
  }, []);

  return (<Layout title="TestPage">
    <Grid container spacing={3}
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{ height: { md: '100%' } }}>
      <Grid item xs={12} md={6}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <CafeOrderRecord handleDataUpdate={handleDataUpdate} />
        <RecordingResult recordData={recordData} handleDataUpdate={handleDataUpdate} />
      </Grid>
      <Grid item xs={12} md={6} sx={{mb: {xs: 4, md: 0}}}>
        <CafeMenuList />
      </Grid>
    </Grid>
  </Layout>)
}