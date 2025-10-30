// 학점 선택에 따라 총 수업 시간을 업데이트하는 함수
function updateTotalHours() {
    const creditHoursSelect = document.getElementById('creditHours');
    const displayTotalHours = document.getElementById('displayTotalHours');
    
    // 1학점당 15주 * 1시간 = 15시간 기준으로 계산
    const credit = parseInt(creditHoursSelect.value);
    const totalHours = credit * 15; 
    
    displayTotalHours.innerText = `${totalHours} 시간`;
}

// 최초 로드 시 총 수업 시간 업데이트
document.addEventListener('DOMContentLoaded', updateTotalHours);

function calculateAttendance() {
    // 1. 입력 값 및 학점 기반 총 시간 가져오기
    const creditHoursSelect = document.getElementById('creditHours');
    const absentHoursInput = document.getElementById('absentHours');
    const resultStatus = document.getElementById('result-status');
    const details = document.getElementById('details');
    
    const credit = parseInt(creditHoursSelect.value);
    const totalHours = credit * 15; // 총 수업 시간 계산

    const absentHours = parseFloat(absentHoursInput.value);

    // 2. 입력 값 유효성 검사
    if (isNaN(absentHours) || absentHours < 0 || absentHours > totalHours) {
        resultStatus.innerText = "유효하지 않은 입력입니다. 결석 시간을 올바르게 확인해주세요.";
        resultStatus.className = 'status-warning';
        details.innerText = "";
        return;
    }

    // 3. 판별 로직
    
    // 최대 허용 결석 시간 (총 시간의 1/3)
    const maxAllowedAbsence = totalHours / 3;
    
    // 학점을 취득할 수 있는 최소 출석 시간 (총 시간의 2/3)
    const minRequiredAttendance = totalHours * (2 / 3); 

    let statusText = '';
    let detailText = '';
    let statusClass = '';

    if (absentHours >= maxAllowedAbsence) {
        // 출석 미달 F 확정
        statusText = "❌ F 학점 (출석 미달) 확정!";
        statusClass = 'status-fail';
        detailText = `누적 결석 시간(${absentHours}시간)이 **최대 허용 시간(${maxAllowedAbsence.toFixed(2)}시간)**을 초과했습니다.`;
    } else {
        // 아직 F가 아님
        const remainingAbsenceBudget = maxAllowedAbsence - absentHours;
        
        statusClass = 'status-safe';
        statusText = "✅ 학점 취득 가능 범위 (SAFE)";
        
        if (remainingAbsenceBudget <= credit) { 
             // 남은 허용 시간이 1주 수업 시간(학점 수) 이하일 경우 경고
            statusClass = 'status-warning';
            statusText = "⚠️ 결석 위험! (Warning)";
        }

        detailText = `
            최대 허용 결석 시간: **${maxAllowedAbsence.toFixed(2)}시간**<br>
            남은 결석 허용 시간: **${remainingAbsenceBudget.toFixed(2)}시간**<br>
            최소 출석 요구 시간: ${minRequiredAttendance.toFixed(2)}시간
        `;
    }

    // 4. 결과 업데이트
    resultStatus.innerHTML = statusText;
    resultStatus.className = statusClass;
    details.innerHTML = detailText;
}